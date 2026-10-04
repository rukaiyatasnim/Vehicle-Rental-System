import { pool } from "../../config/db.js"

const createBooking = async(id:string, data:any) =>{

    const { vehicle_id , rent_start_date,rent_end_date} = data;

    const isVehicleAvailabe = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id] );


    if(isVehicleAvailabe.rows.length === 0){
        throw new Error("Vehicle not found")
    }
    if(isVehicleAvailabe.rows[0].availability_status !== "available" )
        throw new Error("Vehicle is not available")
      
    //Calculate Rent

    const startDate = new Date(rent_start_date)
    const endDate = new Date(rent_end_date) 

    if(endDate <= startDate) {
        throw new Error("Rent end date must be after start date")
    }

    const rent =
    (endDate.getTime() - startDate.getTime()) /
    (1000 * 60 * 60 * 24)



    const dailyRentPrice = isVehicleAvailabe.rows[0].daily_rent_price   
    const totalPrice = rent * dailyRentPrice

    
    const result = await pool.query(`INSERT INTO bookings (customer_id , vehicle_id , rent_start_date,rent_end_date , total_price , status) VALUES($1, $2, $3, $4, $5, $6 ) RETURNING *`, [id, vehicle_id,rent_start_date,rent_end_date, totalPrice  ,"active" ])

    return result

    const updateVehicle = await pool.query(`UPDATE vehicles  SET availability_status=$1  WHERE id=$2`,["booked", vehicle_id]
)
}

const getBooking = async (id: string, role: string) => {

    if (role === "admin") {

        const result = await pool.query(
            `SELECT * FROM bookings`
        )

        return result
    }

    const result = await pool.query(
        `SELECT * FROM bookings WHERE customer_id=$1`,
        [id]
    )

    return result
}
const updateBooking = async(
    bookingId:string,
    userId:string,
    role:string
) => {

    // Find booking
    const booking = await pool.query(
        `SELECT * FROM bookings WHERE id=$1`,
        [bookingId]
    )

    if(booking.rows.length === 0){
        throw new Error("Booking not found")
    }

    const currentBooking = booking.rows[0]

    // Customer
    if(role === "customer"){

        // Can only update own booking
        if(currentBooking.customer_id !== Number(userId)){
            throw new Error("You can only cancel your own booking")
        }

        // Can only cancel active booking
        if(currentBooking.status !== "active"){
            throw new Error("This booking cannot be cancelled")
        }

        // Cannot cancel after rental has started
        const currentDate = new Date()
        const startDate = new Date(currentBooking.rent_start_date)

        if(currentDate >= startDate){
            throw new Error("You cannot cancel this booking after rental has started")
        }

        // Cancel booking
        const result = await pool.query(
            `UPDATE bookings
             SET status='cancelled'
             WHERE id=$1
             RETURNING *`,
            [bookingId]
        )

        // Make vehicle available again
        await pool.query(
            `UPDATE vehicles
             SET availability_status='available'
             WHERE id=$1`,
            [currentBooking.vehicle_id]
        )

        return result
    }


    // Admin
    if(role === "admin"){

        if(currentBooking.status !== "active"){
            throw new Error("This booking is not active")
        }

        // Mark booking as returned
        const result = await pool.query(
            `UPDATE bookings
             SET status='returned'
             WHERE id=$1
             RETURNING *`,
            [bookingId]
        )

        // Make vehicle available
        await pool.query(
            `UPDATE vehicles
             SET availability_status='available'
             WHERE id=$1`,
            [currentBooking.vehicle_id]
        )

        return result
    }

    throw new Error("Unauthorized")
}



export const bookingService ={
    createBooking,
    getBooking,
    updateBooking
}
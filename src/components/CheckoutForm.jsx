import { useState } from 'react'

const MAHALLAHS = ['Ali', 'Aminah', 'Faruq', 'Asiah', 'Bilal', 'Hafsah', 'Uthman', 'Zubair']

// Cafe accpet the pickup within 7 am until 10 pm
const EARLIEST_PICKUP = '07:00'
const LATEST_PICKUP = '22:00'
 
// Function when values come in, object errors appear. No object = valid
function validate(values) {
    const errors = {}

    if (values.name.trim().length < 3) {
        errors.name = 'Enter your name (at least 3 characters).'
    }

    if (!values.mahallah) {
        errors.mahallah = 'Choose your mahallah.'
    }

    if (!values.pickupTime) {
        errors.pickupTime = 'Choose a pickup time.'
    } else if (values.pickupTime < EARLIEST_PICKUP || values.pickupTime > LATEST_PICKUP) {
        errors.pickupTime = `Pickup must be between ${EARLIEST_PICKUP} and ${LATEST_PICKUP}.`
    }

    return errors
}

function CheckoutForm({ onPlaceOrder }) {
    const [values, setValues] = useState({ name: '', mahallah: '', pickupTime: '' })
    const [errors, setErrors] = useState({})

    // A handler for all input
    function handleChange(event) {
        const { name, value } = event.target
        setValues((prev) => ({ ...prev, [name]: value}))
    }

    function handleSubmit(event) {
        event.preventDefault() // prevent page reload
        const found = validate(values)
        setErrors(found)

        if (Object.keys(found).length === 0) {
            onPlaceOrder(values)
        }
    }

    return (
        <form className="card form" onSubmit={handleSubmit} noValidate>
            <h3>Checkout</h3>

            <label htmlFor="name">Name</label>
            <input
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}

            <label htmlFor="mahallah">Mahallah</label>
            <select
                id="mahallah"
                name="mahallah"
                value={values.mahallah}
                onChange={handleChange}
                aria-invalid={Boolean(errors.mahallah)}
            >
                <option value="">Select...</option>
                {MAHALLAHS.map((m) => (
                    <option key={m} value={m}>
                        {m}
                    </option>
                ))}
            </select>
            {errors.mahallah && <p className="field-error">{errors.mahallah}</p>}

            <label htmlFor="pickupTime">Pickup time</label>
            <input
                id="pickupTime"
                name="pickupTime"
                type="time"
                min={EARLIEST_PICKUP}
                max={LATEST_PICKUP}
                value={values.pickupTime}
                onChange={handleChange}
                aria-invalid={Boolean(errors.pickupTime)}
            />
            {errors.pickupTime && <p className="field-error">{errors.pickupTime}</p>}

            <button type="submit" className="btn">
                Place Order
            </button>
        </form>
    )
}

export default CheckoutForm
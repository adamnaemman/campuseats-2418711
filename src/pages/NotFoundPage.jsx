import { Link } from 'react-router'

function NotFoundPage() {
    return (
        <div className="card">
            <h2>404 &mdash; page not found</h2>
            <p className="muted">That address does not exist in CampusEats.</p>
            <Link to="/">Back to the vendors</Link>
        </div>
    )
}

export default NotFoundPage

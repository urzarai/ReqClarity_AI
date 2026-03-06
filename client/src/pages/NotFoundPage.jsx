import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page text-center">
      <h1 style={{ fontSize: '5rem', color: 'var(--color-primary)' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ margin: '1rem 0 2rem' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
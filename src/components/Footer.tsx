export const Footer = () => {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <aside>
        <p><span className="font-bold text-lg">Hotelify</span><br />Your trusted hotel booking partner.</p>
      </aside>
      <nav>
        <h6 className="footer-title">Navigation</h6>
        <a className="link link-hover">Hotels</a>
        <a className="link link-hover">About Us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Terms</a>
      </nav>
      <nav>
        <h6 className="footer-title">Follow Us</h6>
        <div className="flex gap-4">
          <a>🌐</a>
          <a>📘</a>
          <a>🐦</a>
        </div>
      </nav>
    </footer>
  );
};

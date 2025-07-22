export default function ContactPage() {
  return (
    <main>
      <h1>Contact Us</h1>
      <p>Get in touch with our team.</p>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows={4}></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
    </main>
  );
}

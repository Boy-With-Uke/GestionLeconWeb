import { LogoIcon } from "./Icons2";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container p-14 text-center">
        <h3>
          &copy; 2024 E-Hianatra by{" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://github.com/kermanArivelo"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Kerman Arivelo
          </a>
        </h3>
      </section>
    </footer>
  );
};

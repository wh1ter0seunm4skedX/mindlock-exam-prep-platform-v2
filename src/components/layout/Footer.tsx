import packageJson from "../../../package.json";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t bg-background text-muted-foreground text-xs"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 py-4 text-center">
        <p className="tracking-wide font-medium text-[0.75rem] leading-relaxed">
          <span className="transition-colors duration-300 hover:text-primary cursor-default">
            MindLock
          </span>{' '}
          • Version {packageJson.version} • © {year}
        </p>
      </div>
    </footer>
  );
};

export default Footer;

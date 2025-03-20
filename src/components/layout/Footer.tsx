import packageJson from "../../../package.json";

const Footer = () => {
  return (
    <footer className="text-center p-4 text-sm text-muted-foreground">
      Version {packageJson.version}
    </footer>
  );
};

export default Footer;

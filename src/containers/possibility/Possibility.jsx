import possibilityImage from "../../assets/possibility.png";
import "./possibility.css";

const Possibility = () => (
  <div className="gpt3__possibility section__padding" id="possibility">
    <div className="gpt3__possibility-image">
      <img src={possibilityImage} alt="possibility" />
    </div>
    <div className="gpt3__possibility-content">
      <h4>Request Early Access to Get Started</h4>
      <h1 className="gradient__text">
        "How might we ethically leverage artificial intelligence technologies to
        transform the business within the media industry?"
      </h1>
      <p>
        In the world of AI and blockchain, ethics play a starring role. For AI,
        it;s about being fair,honest and accountable, while protecting privacy
        and avoiding biases. For Blockchain, it's all about keeping things
        secure, transparent and responsible with data. We're all about balancing
        innovation with ethics to make tech work for everyone!
      </p>
      <h4>Request Early Access to Get Started</h4>
    </div>
  </div>
);

export default Possibility;

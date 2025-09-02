import Feature from "../../components/feature/Feature";
import "./features.css";

const featuresData = [
  {
    title: "Inclusive",
    text: "At iSai, inclusivity isn't just a buzzword; it's the heart of our mission. We believe in the ethical use of media technology, ensuring the every voice is heard and every perspective is respected. Our commitment to inclusivity means creating content and platforms that unite people, fostering diversity, and championing ethical values. Join us on our journey towards a media landscape where everyone feels represented and respected",
  },
  {
    title: "Smart",
    text: "We've revolutionized the way content creators are compensated. Say goodbye to opaque payment systems and hello to transparency and trust. Our smart contracts ensure that contributors receive the fair share automatically and securely.It's media made smarter, fairer and more efficient- that's the iSai way.",
  },
  {
    title: "Artificial Intelligence",
    text: "Our AI-driven solutions are the future of content creation and curation. From personalised recommendations that anticipate your preferences to content analysis that ensures qualtiy and relevance, AI is at our core. Experience the magic of AI as it enhances your media journey, making it more intelligent, engaging and tailored to you. Join us in embracing the AI revolution, one innovation at a time",
  },
];

const Features = () => (
  <div className="gpt3__features section__padding" id="features">
    <div className="gpt3__features-heading">
      <h1 className="gradient__text">
        The Future is Now and You Just Need to Realize It. Step into Future
        Today. & Make it Happen.
      </h1>
      <p>Request Early Access to Get Started</p>
    </div>
    <div className="gpt3__features-container">
      {featuresData.map((item, index) => (
        <Feature title={item.title} text={item.text} key={item.title + index} />
      ))}
    </div>
  </div>
);

export default Features;

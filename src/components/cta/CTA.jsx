import { useLocation } from "react-router-dom";
import "./cta.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../components/google/firebase";
import { TextUpload } from "../../components/index";
import { useEffect, useState } from "react";

const CTA = ({
  voiceSelector,
  showContent,
  handleSelectedArtist,
  selectedArtist,
}) => {
  const location = useLocation();
  const isUserDashboard = location.pathname === "/user-dashboard";
  const isLanding = location.pathname === "/";

  const [usersWithVocalize, setUsersWithVocalize] = useState([]);
  const users = [];

  const getUsersWithVocalize = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("types.Vocalize", "==", true));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setUsersWithVocalize(users);
    console.log("users", users);
  };

  let type = "";
  switch (showContent) {
    case 1:
      type = "Voice";
      break;
    case 2:
      type = "Script";
      break;
    case 3:
      type = "Art";
      break;
    default:
      type = "";
  }

  useEffect(() => {
    if (voiceSelector && isUserDashboard) {
      getUsersWithVocalize();
    }
  }, [voiceSelector, isUserDashboard]);
  return (
    <>
      {isLanding && (
        <div className="gpt3__cta">
          <div className="gpt3__cta-content">
            <p>Request Early Access to Get Started</p>
            <h3>Register Today & start exploring the endless possibilities.</h3>
          </div>
          <div className="gpt3__cta-btn">
            <button type="button">Get Started</button>
          </div>
        </div>
      )}
      {voiceSelector && isUserDashboard && showContent && (
        <div className="gpt3__cta-user">
          {!selectedArtist ? (
            <>
              <div className="gpt3__cta-content-user">
                <p>View Different {type} Available On Our Platform</p>
                <h3>Select a {type} from our talent pool</h3>
              </div>

              <div className="gpt3__cta-content-user">
                <ul>
                  {usersWithVocalize.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => handleSelectedArtist(user)}
                    >
                      <img src={user.photoURL} alt="User" />
                      User ID: {user.displayName}, Wallet Address:
                      {user.walletAddress}
                      iSai Talent NFT:
                      <img
                        className="gpt3__cta-content-user .nft-image"
                        src="https://bafybeiejohruxjwcmccrvz6cynhnplsiaoyltmwnyklvhlo6i5evk5rwai.ipfs.nftstorage.link/"
                        alt="Talent NFT"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="gpt3__cta-content-user">
                <h2>Upload Your Text for a Stunning Podcast Voice Over</h2>
                <button
                  style={{ marginLeft: "500px", marginRight: "1310px" }}
                  onClick={() => handleSelectedArtist()}
                >
                  Choose Again
                </button>
              </div>
              <TextUpload selectedArtist={selectedArtist} />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CTA;

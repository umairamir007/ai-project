import Article from "../../components/article/Article";
import { blog01, blog02, blog03, blog04, blog05 } from "./imports";
import "./blog.css";
import { parseEther } from "viem";
import { useLocation } from "react-router-dom";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useAccount,
} from "wagmi";
import { Snackbar } from "../../components/index";
import { useState } from "react";

const Blog = ({ selectedArtist }) => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isUserDashboard = location.pathname === "/user-dashboard";
  const [snack, setSnack] = useState({ message: "", type: "" }); // Snackbar state

  const { address, isConnected } = useAccount();

  const { config, error } = usePrepareSendTransaction({
    to: selectedArtist?.walletAddress,
    value: parseEther("0.01"),
  });
  const { sendTransaction } = useSendTransaction(config);

  const handleRoyaltyPayment = async () => {
    console.log("Royalty payment");
    if ((!address, !isConnected)) {
      setSnack({
        message: `Please connect wallet first`,
        type: "error",
      });
      return;
    }

    if (address === selectedArtist?.walletAddress) {
      setSnack({
        message: `Talent cannot tip itself change wallet address`,
        type: "error",
      });
      return;
    }

    // if (!selectedArtist?.walletAddress) {
    //   setSnack({
    //     message: `Please Select Talent & Generate Podcast First`,
    //     type: "error",
    //   });
    //   return;
    // }

    await sendTransaction?.();

    setSnack({
      message: `Royalty Payment successfull`,
      type: "success",
    });
  };

  return (
    <>
      {isLanding && (
        <div className="gpt3__blog section__padding" id="blog">
          <div className="gpt3__blog-heading">
            <h1 className="gradient__text">
              A lot is happening, <br /> We are blogging about it.
            </h1>
          </div>
          <div className="gpt3__blog-container">
            <div className="gpt3__blog-container_groupA">
              <Article
                imgUrl={blog01}
                date="Sep 26, 2021"
                text="GPT-3 and Open  AI is the future. Let us explore how it is?"
              />
            </div>
            <div className="gpt3__blog-container_groupB">
              <Article
                imgUrl={blog02}
                date="Sep 26, 2021"
                text="GPT-3 and Open  AI is the future. Let us explore how it is?"
              />
              <Article
                imgUrl={blog03}
                date="Sep 26, 2021"
                text="GPT-3 and Open  AI is the future. Let us explore how it is?"
              />
              <Article
                imgUrl={blog04}
                date="Sep 26, 2021"
                text="GPT-3 and Open  AI is the future. Let us explore how it is?"
              />
              <Article
                imgUrl={blog05}
                date="Sep 26, 2021"
                text="GPT-3 and Open  AI is the future. Let us explore how it is?"
              />
            </div>
          </div>
        </div>
      )}
      {isUserDashboard && (
        <div className="gpt3__blog section__padding" id="blog">
          <div className="gpt3__blog-heading">
            <Snackbar
              message={snack.message}
              type={snack.type}
              onDismiss={() => setSnack({ message: "", type: "" })}
            />
            <h1 className="gradient__text">
              Generate Podcast & Pay Royalty To Talent
            </h1>
          </div>
          <div className="gpt3__blog-container">
            <button onClick={handleRoyaltyPayment}>
              Click Here To Support Talent
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;

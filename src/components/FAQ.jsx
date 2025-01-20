import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is Memefrenzy?",
      answer: "Memefrenzy is a meme-based token built on the Solana blockchain, aiming to unite crypto enthusiasts through humor, engagement, and rewards.",
    },
    {
      question: "How can I purchase $MEME tokens?",
      answer: "You can purchase $MEME tokens on supported Solana DEXs. More details will be provided during the official launch.",
    },
    {
      question: "What utilities does $MEME offer?",
      answer: "$MEME supports staking, NFT integrations, meme competitions, and governance through MemeDAO to empower the community.",
    },
    {
      question: "How do I participate in the airdrop?",
      answer: "Follow our official social channels for updates on airdrop eligibility and participation steps.",
    },
    {
      question: "What are the future plans for Memefrenzy?",
      answer: "Our roadmap includes staking rewards, partnerships, NFT marketplace launch, meme competitions, and expansion to other blockchains like Ethereum and Binance Smart Chain.",
    },
  ];

  return (
    <section id="faq" className="bg-black text-white py-16 py-12"
    data-aos="fade-up"

    >
      <div className="container mx-auto px-6 md:px-16">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              {/* Question */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{faq.question}</h3>
                <span className={`text-yellow-500 text-2xl ${openIndex === index ? "rotate-180" : ""} transform`}>
                  ⌵
                </span>
              </div>
              {/* Answer */}
              {openIndex === index && (
                <p className="mt-4 text-gray-300">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

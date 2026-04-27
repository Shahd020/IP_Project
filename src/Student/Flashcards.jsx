import React, { useState } from "react";
import { Search, MoreVertical, ArrowLeft, ChevronLeft, ChevronRight, PlayCircle, Check } from "lucide-react";

function Flashcards() {
  // State variables for Study Mode
  const [activeSet, setActiveSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Mock data matching the user's specific enrolled and completed courses
  const flashcardSets = [
    { 
      title: "Cyber Security & Cryptography", 
      terms: 4, 
      author: "Stanford Inst.", 
      avatarColor: "bg-red-500",
      cards: [
        { front: "A method of scrambling data so that only authorized parties can understand it.", back: "Encryption" },
        { front: "A cryptographic concept where a pair of keys (public and private) is used.", back: "Asymmetric Cryptography" },
        { front: "An attack that floods a system with traffic to prevent legitimate users from accessing it.", back: "DDoS (Distributed Denial of Service)" },
        { front: "A security principle ensuring that data is not altered by unauthorized individuals.", back: "Integrity" }
      ]
    },
    { 
      title: "2D Game Dev: Unity & C#", 
      terms: 4, 
      author: "Harvard Game Lab", 
      avatarColor: "bg-purple-500",
      cards: [
        { front: "A 2D image used in a game, often grouped together into a sheet for character animations (like Aira).", back: "Sprite / Sprite Sheet" },
        { front: "The Unity component required to apply physical forces and gravity to Kael.", back: "Rigidbody2D" },
        { front: "The built-in Unity method that gets called exactly once per frame in a C# script.", back: "Update()" },
        { front: "The system used to transition a character between idle, running, and jumping states.", back: "Animator Controller" }
      ]
    },
    { 
      title: "Internet Programming (React & Vite)", 
      terms: 4, 
      author: "Meta Open Source", 
      avatarColor: "bg-blue-500",
      cards: [
        { front: "A React Hook used to add state variables to functional components.", back: "useState" },
        { front: "A JavaScript syntax extension that looks very similar to HTML, used heavily in React.", back: "JSX" },
        { front: "The modern frontend build tool that is significantly faster than Create React App.", back: "Vite" },
        { front: "A React Hook used to perform side effects, like fetching data from an API.", back: "useEffect" }
      ]
    },
    { 
      title: "Cloud Computing Fundamentals", 
      terms: 3, 
      author: "AWS Training", 
      avatarColor: "bg-orange-500",
      cards: [
        { front: "A cloud computing model that provides virtualized computing resources over the internet.", back: "IaaS (Infrastructure as a Service)" },
        { front: "The ability of a cloud system to automatically handle increases or decreases in workload.", back: "Elasticity" },
        { front: "A highly scalable object storage service offered by AWS.", back: "Amazon S3" }
      ]
    },
    { 
      title: "Object-Oriented Design (OOD)", 
      terms: 3, 
      author: "Dr. Turing", 
      avatarColor: "bg-teal-500",
      cards: [
        { front: "Hiding the internal state and requiring all interaction to be performed through an object's methods.", back: "Encapsulation" },
        { front: "The ability of different classes to be treated as instances of the same class through inheritance.", back: "Polymorphism" },
        { front: "A visual modeling language used for specifying, visualizing, and documenting software systems (like a Supply Chain system).", back: "UML (Unified Modeling Language)" }
      ]
    },
    { 
      title: "Software Project Management", 
      terms: 3, 
      author: "Prof. Smith", 
      avatarColor: "bg-indigo-500",
      cards: [
        { front: "A type of bar chart that illustrates a project schedule, mapping tasks over time.", back: "Gantt Chart" },
        { front: "A visual representation of project activities as nodes, connected by arrows showing dependencies.", back: "AON (Activity-on-Node) Diagram" },
        { front: "The longest sequence of tasks in a project plan which must be completed on time for the project to finish by its deadline.", back: "Critical Path" }
      ]
    }
  ];

  const handleStartStudying = (set) => {
    if (set.cards && set.cards.length > 0) {
      setActiveSet(set);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } else {
      alert("No cards available in this set yet!");
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < activeSet.cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(currentCardIndex + 1), 150);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(currentCardIndex - 1), 150);
    }
  };

  const handleBackToSets = () => {
    setActiveSet(null);
    setIsFlipped(false);
  };

  return (
    <div>
      {/* --- GRID VIEW (Shows when NOT studying) --- */}
      {!activeSet && (
        <>
          <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Flashcard Sets</h1>

            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search sets..."
                className="w-full bg-[#1f2937] text-white pl-9 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {flashcardSets.map((set, index) => (
              <div
                key={index}
                className="bg-[#1f2937] rounded-xl p-5 border border-gray-800 shadow-lg hover:border-gray-600 transition-colors flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{set.title}</h3>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-md font-medium">
                    {set.terms} terms
                  </span>
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={() => handleStartStudying(set)}
                    className="w-full bg-[#374151] hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors mb-4"
                  >
                    <PlayCircle size={16} />
                    Start Studying
                  </button>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner ${set.avatarColor}`}>
                      {set.author.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-400 font-medium">{set.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- STUDY MODE VIEW (Shows when activeSet is selected) --- */}
      {activeSet && (
        <div className="max-w-3xl mx-auto mt-4">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={handleBackToSets}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-semibold">Back to Sets</span>
            </button>
            <h2 className="text-xl font-bold text-gray-200">{activeSet.title}</h2>
          </div>

          {/* The Flashcard */}
          <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[400px] [perspective:1000px] mb-8 group">
            <div 
              className={`w-full h-full transition-all duration-500 [transform-style:preserve-3d] cursor-pointer ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              
              {/* Front of Card (Dark) */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#1f2937] border border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center shadow-2xl">
                <span className="absolute top-6 left-6 text-gray-500 text-sm font-medium tracking-widest uppercase">Term</span>
                <p className="text-base sm:text-xl lg:text-2xl text-center leading-relaxed text-gray-100 font-medium">
                  {activeSet.cards[currentCardIndex].front}
                </p>
                <span className="absolute bottom-6 text-gray-500 text-sm font-medium">Click to flip</span>
              </div>

              {/* Back of Card (Subtle Dark Purple) */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-[#2d1b4e] to-[#170b24] border border-[#3b2363] rounded-2xl p-10 flex flex-col items-center justify-center shadow-2xl">
                <span className="absolute top-6 left-6 text-purple-400 text-sm font-medium tracking-widest uppercase">Definition</span>
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-center text-purple-50 leading-relaxed">
                  {activeSet.cards[currentCardIndex].back}
                </p>
              </div>

            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between bg-[#1f2937] p-4 rounded-xl shadow-lg border border-gray-800">
            <button 
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${currentCardIndex === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-[#374151]'}`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            
            <div className="text-gray-400 font-semibold">
              Card {currentCardIndex + 1} of {activeSet.cards.length}
            </div>

            {/* Dynamic Next / Done Button */}
            {currentCardIndex === activeSet.cards.length - 1 ? (
              <button 
                onClick={handleBackToSets}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              >
                Done
                <Check size={20} />
              </button>
            ) : (
              <button 
                onClick={handleNextCard}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-white hover:bg-[#374151]"
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default Flashcards;
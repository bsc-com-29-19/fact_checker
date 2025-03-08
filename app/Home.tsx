const handleSend = async (text: string): Promise<Message> => {
    console.log("User input:", text);
  
    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
  
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Received response:", data);
  
      return {
        id: String(Date.now()),
        text: data.reply,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return {
        id: String(Date.now()),
        text: "Sorry, I couldn't fetch an answer. Please try again later.",
        timestamp: new Date(),
      };
    }
  };
  
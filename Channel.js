var Commands = require("./Commands");
const fetch = require('node-fetch');
class Channel {
    constructor (){
        this.enableLLM = process.env.ENABLE_LLM || false;
        this.baseUrlOfLLM = process.env.BASE_URL_OF_LLM || "http://localhost:8000/chat";
    }
    async runCommand(userProfile, messageText, replier) {
        const processCommand = (_messageText) => {
            console.log(`process command: ${_messageText}`);
            const msgText = _messageText.replace(/\s*,\s*/g,','); //remove the space before/after comma
            var phases = msgText.split(" ");
            var cmd = phases[0];
            var argv = phases.slice(1);

            let command = Commands.getCommand(cmd);
            command && command.run(
                {
                    argv,
                    rawCommand: messageText,
                    userProfile
                },
                replier,
                this);
        }

        const deployPattern = /^deploy\s+[^-\s]+\s+[^-\s]+(?:\s+-t\s+[^-\s]+)?$/;
        if (!deployPattern.test(messageText)) {
            console.log('enableLLM:' + process.env.ENABLE_LLM);
          
            if (this.enableLLM){
                const responseData = await this.sendToLLM(userProfile.userId, messageText);
                if (!responseData) {
                    return replier('The LLM is not available.');
                }
                if (responseData.content) {
                    return replier(responseData.content);
                }

                const tool_calls = responseData.tool_calls;
                if (tool_calls && tool_calls.length > 0) {
                    const toolCall = tool_calls[0];
                    if (toolCall.name === 'DeployInfo') {
                        const args = toolCall.args
                        processCommand(`deploy ${args.project} ${args.server} ${args.tag ? ` -t ${args.tag}` : ''}`);
                    }
                    this.clearLLMHistory();
                    return;
                }
                replier("LLM can't handle it!");
                return;
            }
 
        }
        processCommand(messageText);
    }

    async sendToLLM(userId, messageText){   
        const data = {
            "session_id": userId,
            "user_input": messageText
        };
        try {
            const response = await fetch(`${this.baseUrlOfLLM}/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            console.log(`LLM response:${JSON.stringify(responseData)}`);
            return responseData;
        } catch (error) {
            console.log(error);
        }
    }

    async clearLLMHistory(userId) {
        const clearHistoryResponse = await fetch(`${this.baseUrlOfLLM}/clear_history?session_id=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // 空对象
        });
        
        if (!clearHistoryResponse.ok) {
            throw new Error(`HTTP error! Status: ${clearHistoryResponse.status}`);
        }
        const clearHistoryResponseData = await clearHistoryResponse.json();
        console.log(`Clear History Response: ${JSON.stringify(clearHistoryResponseData)}`);
    }
}

module.exports = Channel

import React, { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { codeBlockLanguages$, codeBlockPlugin, codeMirrorPlugin, headingsPlugin, linkPlugin, listsPlugin, MDXEditor } from '@mdxeditor/editor';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

async function GenerateChat(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text)
  return text
}

const ChatBot = () => {



  // ## Creating REST APIs: A Comprehensive Guide

  // Creating REST APIs involves several steps, from planning to implementation and deployment. Here's a comprehensive guide covering the essentials:

  // **1. Planning and Design**

  // * **Define API scope:** Determine the resources, functionalities, and target audience for your API.
  // * **Choose a suitable HTTP method:** Select the appropriate HTTP method (GET, POST, PUT, DELETE, PATCH) for each API endpoint based on the action it performs.
  // * **Design API endpoints:** Define logical and consistent URLs for accessing your resources. Follow RESTful principles like resource-oriented paths and clear verbs.
  // * **Define request and response formats:** Decide on data formats like JSON or XML for requests and responses.
  // * **Implement authentication and authorization:** Secure your API by implementing authentication and authorization mechanisms like API keys, OAuth, or JWT.
  // * **Versioning:** Plan for future changes and compatibility by implementing versioning strategies for your API.

  // **2. Choosing a Development Stack**

  // * **Backend framework:** Select a framework that supports RESTful API development based on your language and preferences. Popular choices include:
  //     * **Python:** Django REST Framework, Flask, FastAPI
  //     * **Node.js:** Express.js, Koa, NestJS
  //     * **Java:** Spring Boot, Dropwizard, Jakarta RESTful Web Services
  //     * **Ruby:** Rails, Grape
  //     * **PHP:** Laravel, Symfony
  // * **Database:** Choose a database system based on your data requirements.
  // * **Testing framework:** Select a testing framework for unit testing and integration testing of your API.

  // **3. Implementation**

  // * **Create API endpoints:** Define your API endpoints as functions within your framework. Handle incoming requests and process data.
  // * **Implement business logic:** Write the logic to interact with your database and perform the required operations based on the HTTP method.
  // * **Handle responses:** Generate appropriate responses with the requested data in the chosen format.
  // * **Implement error handling:** Handle potential errors gracefully and return informative error messages.
  // * **Test your API:** Execute unit tests and integration tests to ensure your API functions correctly.

  // **4. Deployment and Monitoring**

  // * **Choose a deployment platform:** Select a cloud provider or self-hosted server to deploy your API.
  // * **Set up API documentation:** Create clear and concise documentation for your API, outlining endpoints, request and response formats, authentication details, and error codes.
  // * **Monitor your API:** Track metrics like API calls, latency, and error rates to identify potential issues and optimize performance.

  // **5. Additional Considerations**

  // * **Security:** Implement robust security measures like input validation, rate limiting, and encryption to protect your API and data.
  // * **Scalability:** Design your API with scalability in mind, considering potential future growth in traffic and data volume.
  // * **Versioning and backward compatibility:** Manage API versions effectively to ensure backward compatibility and minimize disruptions for existing clients.
  // * **Documentation:** Provide comprehensive documentation to help developers integrate with your API effectively.

  // **Example Code Snippet (Node.js with Express.js)**

  // \`\`\`
  // javascript
  // const express = require('express');
  // const app = express();

  // app.use(express.json());

  // app.get('/users', (req, res) => {
  //   // Logic to fetch users from database
  //   const users = [
  //     { id: 1, name: 'John Doe' },
  //     { id: 2, name: 'Jane Doe' }
  //   ];
  //   res.json(users);
  // });

  // app.post('/users', (req, res) => {
  //   // Logic to create a new user
  //   const newUser = req.body;
  //   // Save user to database
  //   res.status(201).json({ message: 'User created successfully' });
  // });

  // app.listen(3000, () => {
  //   console.log('API server listening on port 3000');
  // });
  // \`\`\`

  // This guide provides a comprehensive overview of creating REST APIs. Remember to research and choose the tools and technologies that best fit your project's requirements and preferences.

  const [prompt, setPropmt] = useState("")
  const [chat, setChat] = useState([])

  const Chat = async () => {
    try {
      const response = await GenerateChat(prompt)
      const document = response.replace(/```javascript|```\njavascript|```python|```\npython|```bash|```\nbash/g, '```js')
      setChat(p => [...p, [prompt, document]])
    } catch (error) {
      console.log(error.message)
      setChat(p => [...p, [prompt, "Sorry, there was a problem"]])
    }
  }

  return (
    <div className='w-[30%] bg-[#E1F7DD] rounded-l-xl flex relative py-3'>
      <div className='absolute bottom-2 w-full rounded-md bg-[#3C2A21] flex justify-between items-center pr-2 py-1'>
        <input onChange={(e) => setPropmt(e.target.value)} className='chat-input h-8 px-1 bg-[#3C2A21] rounded-lg text-[#D5CEA3] w-72 text-sm' type="text" />
        <span onClick={Chat} class="material-symbols-outlined cursor-pointer bg-[#E5E5CB] rounded-full px-1 py-1">
          arrow_upward
        </span>
      </div>
      <div className='flex flex-col px-5 w-full max-h-[27.5rem] overflow-y-auto'>
        {chat.length > 0 ? chat.map(text => {
          // console.log(text)
          return <div className='flex flex-col w-[100%] text-[#D5CEA3] relative'>
            <p className='text-left w-fit py-1 px-3 my-2 text-sm rounded-xl bg-[#3C2A21]'>{text[0]}</p>
            <MDXEditor readOnly className='chat-mdx text-left w-fit my-2 text-sm rounded-xl bg-[#3C2A21] text-[#D5CEA3]' markdown={text[1]} plugins={[headingsPlugin(), listsPlugin(), linkPlugin(), codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
            codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),]} />
          </div>
        }) : <p className='text-left w-fit py-1 px-3 my-2 text-sm rounded-xl text-[#D5CEA3] bg-[#3C2A21]'>Hello, how can i help you</p>}
      </div>
    </div>
  )
}

export default ChatBot

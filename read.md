walking through your final product - please focus on walking through the final functionality and design, along with a brief discussion of your code. 

this is an assesment recieved from the comapnay vectoershift for job openings frontend developer. 

make a md file listing out all the points to be highlighted and mentions and some brief explaination of what it is and what it does ? 
list them on priority basis 


in my opnion its important to highlight the following:

1. Your task is to create an abstraction for these nodes that speeds up your ability to
create new nodes and apply styles across nodes in the future.
Once you have created your abstraction, make five new nodes of your choosing to
demonstrate how it works. Don’t spend too long worrying about what the nodes
actually do; you should use this as an opportunity to showcase the
flexibility/efficiency of your node abstraction. - for step 1. predefined were: input, llm, output and text. rest are new 

2. The frontend files you receive do not apply any significant styling. Your task is to style
the various components into an appealing, unified design. You can use the
VectorShift’s existing styles as inspiration if you’d like, but you are also free to create
your own design from the ground-up. You can use whatever React packages/libraries
that you would like. - highlight scss and its advantages like why we used .module.scss and all

3. First, we want the width and height of the Text node to change as the user enters
more text into the text input, improving visibility for what the user types in.
Second, we want to allow users to define variables in their text input. When a user
enters a valid JavaScript variable name surrounded by double curly brackets (e.g., “{{
input }}”), we want to create a new Handle on the left side of the Text node that
corresponds to the variable. for step 3 and brief me how it works and the flow 

4. On the frontend, you should update /frontend/src/submit.js to send the nodes
and edges of the pipeline to the /pipelines/parse endpoint in the backend when
the button is clicked.
On the backend, you should update the /pipelines/parse endpoint in
/backend/main.py to calculate the number of nodes and edges in the pipeline. You
should also check whether the nodes and edges in the pipeline form a directed acyclic
graph (DAG). The response from this endpoint should be in the following format:
{num_nodes: int, num_edges: int, is_dag: bool}.
Once you have updated the button and the endpoint, you should create an alert that
triggers when the frontend receives a response from the backend. This alert should
display the values of num_nodes, num_edges, and is_dag in a user-friendly manner.
The final result should allow a user to create a pipeline, click submit, and then
receive an alert with the number of nodes/edges as well as whether the pipeline is a
DAG. - for step 4 


tell me if any of the above functionality is missing 

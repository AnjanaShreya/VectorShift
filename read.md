The Text node included in the /frontend/src/nodes has a field for text input. We
want to improve the functionality of this text input in two ways.
First, we want the width and height of the Text node to change as the user enters
more text into the text input, improving visibility for what the user types in.
Second, we want to allow users to define variables in their text input. When a user
enters a valid JavaScript variable name surrounded by double curly brackets (e.g., “{{
input }}”), we want to create a new Handle on the left side of the Text node that
corresponds to the variable.
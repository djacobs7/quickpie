export const create_component_prompt = ```Write a react component that can call the OpenAPI endpoint, and render the following story.  Use tailwindcss.  Make sure to actually call the API. Return only the component code.  If it is a client side component, make sure to start the code with "use client".   Use 'fetch' instead of axios. 

{{story}}

```
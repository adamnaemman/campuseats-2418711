# Week 1 reflection
 
1. What is the difference between building a UI imperatively (plain DOM code) and 
declaratively (React)?
    Answer : Plain DOM code means we construct the coding manually. We do the EventListener and also change their state manually like ON and OFF using textContent function. React library are different because we construct the component by using the HTML tag where we can build the component based on the markup language and little bit JS like useState function for change the state component.
 
2. Why must a component name start with a capital letter?
    Answer : It is because it is easier for other developer to read it as a component. It is also for easier differentiate the between variable and component. Then, JSX will differentiate between native HTML elements and custom React components by using the capital letter.
 
3. What does a fragment <>...</> do, and why not just use a <div>?
    Answer : 
    Firstly, it will defined invalid HTML tag for further used. For example, <table> tag. Inside table tags, we cannot put <div></div> tag. If we construct a mini component that return <div> tag and we want to put inside the <table>, it will be invalid.
 
4. Name one benefit of splitting the UI into small components.
    Answer : Reusablity. After we created custom React component, we can using anytime in App.jsx without add anything besides the props.


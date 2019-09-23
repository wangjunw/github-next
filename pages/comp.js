import { useEffect, useState, useReducer, useContext, useRef } from 'react';
import myContext from '../libs/my-context';
const countReducer = (state, action) => {
    switch (action.type) {
        case 'add':
            return state + 1;
        default:
            return state;
    }
};
const Comp = () => {
    // const [count, setCount] = useState(0);
    const [count, dispatchCount] = useReducer(countReducer, 0);
    // 使用context
    const context = useContext(myContext);
    // 使用ref
    const myRef = useRef();
    useEffect(() => {
        const timer = setInterval(() => {
            // setCount(c => c + 1);
            dispatchCount({ type: 'add' });
        }, 1000);
        console.log(myRef);
        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <div>
            <p>{count}</p>
            <h3>{context}</h3>
            <input ref={myRef} />
        </div>
    );
};
export default Comp;

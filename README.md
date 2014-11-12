automa.js
=========

JavaScript library implementing a finite state machine

You can easily define states and events, like

    STATE = {
        S1 : "State 1",
        S2 : "State 2"
    };

    EVENT = {
        E1 : "Event 1",
        E2 : "Event 2"
    };

then instantiate a new state machine by declaring the initial state (aka entry point)

    var automa = AUTOMA.automa(STATE.S1);
    
After that you can easily program the various transitions

    var executed1 = false;
    var executed2 = false;
    automa.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDo(function() { executed1 = true; });
    automa.from(STATE.S2).stay().when(EVENT.E1).andDo(function() { executed2 = true; });

Your program will the start signalling events to the state machine and it will nicely react as you'd expect it to

    automa.signal(EVENT.E1); // executed1 is now true
    automa.signal(EVENT.E1); // executed2 is now true

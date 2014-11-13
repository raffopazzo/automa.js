/**
 * Automa implements a state machine which can be easily programmed using a
 * DSL-like language, e.g
 *
 * For example
 *
 * var music_player = new Automa(STOPPED);
 *
 * automa.from(STOPPED).goTo(PLAYING).when(PLAY).andDo(play);
 * automa.from(PLAYING).goTo(PAUSED).when(PLAY).andDo(pause);
 * automa.from(PLAYING).gotTo(STOPPED).when(STOP).andDo(stop);
 *
 * function play() { }
 * function stop() { }
 * function pause() { }
 *
 * Then it's just a matter of signalling events to the state machine and it will
 * execute the appropriate action based on the current state and event.
 *
 * automa.signal(PLAY);
 * automa.signal(PAUSE);
 * automa.signal(STOP);
 */

/* Detect if the host has Array.filter and provide one if not. */
if ( ! Array.prototype.filter) {
    /**
     * Filter all the elements in the array satisfying a specific predicate.
     *
     * @param predicate_fn Callback implementng the predicate to test.
     *
     * @return An array of all the elements that satisfy the predicate.
     */
    Array.prototype.filter = function(predicate_fn) {
        var result = [];
        for (var i=0; i<this.length; i++) {
            var item = this[i];
            if (predicate_fn(item)) {
                result.push(item);
            }
        }
        return result;
    }
}

/**
 * Construct a new state machine which starts in the specifcied initial state.
 *
 * @param initialState The state the machine starts from.
 */
function Automa(initialState) {
    var currentState = initialState; /**< The current state of the machine.*/
    var transitions  = [];           /**< List of all possible transitions.*/
    var eventsQueue  = [];           /**< Queue of events being processed. */
    var processingEvents = false;    /**< Flag indicating whether events are
                                          already being processed.*/
    var childAutoma;

    /**
     * Starts a transition declaration.
     *
     * @param state The state the transition starts from.
     *
     * @return A TransitionDescriptor object to use to programme the transition.
     */
    this.from = function __Automa_from(state) {
        return new TransitionDescriptor(state);
    }

    /**
     * Starts a transition declaration where the final state is the same as the
     * initial state.
     *
     * @param state The state the machine should stay on.
     *
     * @return A TransitionDescriptor object to use to programme the transition.
     */
    this.stayOn = function __Automa_from(state) {
        return new TransitionDescriptor(state).goTo(state);
    }

    /**
     * Send an event to the state machine, to try trigger a transition. If the
     * event being sent to the state machine doesn't trigger a transition from
     * the current state, then the event is ignored and the machine presists in
     * the current state. If the action executed as part of a transition tries
     * to trigger another transition, ie by means of another call to
     * signal(), the event will be queued up to guarantee correct state
     * transitions and later processed once the original transition has reached
     * the corresponding final state.
     *
     * @param event The event to send to the state machine.
     */
    this.signal = function __Automa_signal(event) {
        eventsQueue.push(event);
        if ( ! processingEvents) {
            __Automa_processEvents();
        }
    }
    
    this.addChild = function __Automa_addChild(state, child) {
    	childAutoma = child;
    };

    /* --- end of function --- */

    /**
     * Process all the events currently in the queue by triggering the
     * corresponding transition based on the current state. At the end of each
     * transition the current state will be updated in order to process the next
     * event in the queue. This guarantees that all events are processed in the
     * correct order, even if the signal() function is invoked from inside an
     * action executed as part of another transition.
     */
    function __Automa_processEvents() {
        var current_transition, event;
        processingEvents = true;
        while(eventsQueue.length > 0) {
            event = eventsQueue.shift();
            if (childAutoma) {
            	childAutoma.signal(event);
            }
            else {
	            current_transition = transitions.filter(function(t) {
	                return t.initialState === currentState
	                    && t.event === event;
	            }).pop();
	            if (current_transition) {
	                current_transition.action();
	                currentState = current_transition.finalState;
	            }
	        }
        }
        processingEvents = false;
    }

    /**
     * Construct a new TransitionDescriptor object which can be used to programme a
     * state transition. The user shouldn't be aware of this object as he/she is
     * supposed to program a state transition using method chaining, eg:
     *
     * automa.from(INITIAL_STATE).goTo(FINAL_STATE).when(EVENT).andDo(ACTION);
     *
     * @param state The state the transition starts from.
     */
    function TransitionDescriptor(state) {
        var thiz = this;
        var transition = {
            initialState: state,
            finalState:   null,
            event:        null,
            action:       null
        }

        /**
         * Specifies the final state of the transition.
         *
         * @param finalState The state the machine will be on.
         *
         * @return The current TransitionDescriptor to allow method chaining.
         */
        this.goTo = function __Automa_TransitionDescriptor_goTo(finalState) {
            transition.finalState = finalState;
            return thiz;
        }

        /**
         * Specifies the event the transition reacts to.
         *
         * @param event The event triggering the current transition.
         *
         * @return The current TransitionDescriptor to allow method chaining.
         */
        this.when = function __Automa_TransitionDescriptor_when(event) {
            transition.event = event;
            return thiz;
        }

        /**
         * Specifies the action to execute while transitioning.
         *
         * @param action The action the state machine will execute while
         *               transitioning.
         */
        this.andDo = function __Automa_TransitionDescriptor_andDo(action) {
            transition.action = action;
            transitions.push(transition);
        }

        /**
         * Helper method in case there's no action to execute while
         * transitioning.
         */
        this.andDoNothing = function __Automa_TransitionDescriptor_andDoNothing() {
            this.andDo(function() { });
        }
    }
}


AUTOMA = {
    automa: function(initialState) {
        var currentState = initialState;
        var transitions = [];

        return {
            from: function (state) {
                var transition = {
                    initialState: state,
                    finalState: null,
                    event: null,
                    action: null
                }
                return {
                    stay: function() {return this.goTo(transition.initialState);},
                    goTo: function(state) {
                        transition.finalState = state;
                        return this;
                    },
                    when: function(e) {
                        transition.event = e;
                        return this;
                    },
                    andDo: function(a) {
                        transition.action = a;
                        transitions.push(transition);
                    }
                }
            },
            signal: function(event) {
                var transition = transitions.filter(function(t) {
                    return t.initialState === currentState &&
                           t.event === event;
                }).pop();
                transition.action();
                currentState = transition.finalState;
            }
        }
    }
}


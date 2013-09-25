AUTOMA = {
    automa: function(initialState) {
        var action = null;
        return {
            from: function() {return this;},
            stay: function() {return this;},
            goTo: function() {return this;},
            when: function() {return this;},
            andDo: function(a) {this.action = a; return this;},
            signal: function() {this.action();}
        }
    }
}


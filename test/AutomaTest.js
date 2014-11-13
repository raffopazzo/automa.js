STATE = {
    S1 : "State 1",
    S2 : "State 2"
};

SUB_STATE = {
    SS1 : "Sub-State 1",
    SS2 : "Sub-State 2"
};

EVENT = {
    E1 : "Event 1",
    E2 : "Event 2"
};

test("Should run action when stay", function() {
    var automa = new Automa(STATE.S1);
    var executed = false;
    automa.stayOn(STATE.S1).when(EVENT.E1).andDo(function() { executed = true; });
    automa.signal(EVENT.E1);
    ok(executed === true, "Action executed");
});

test("Should ignore irrelevant events", function() {
    var automa = new Automa(STATE.S1);
    automa.signal(EVENT.E1);
    ok(true, "Event ignored");
});

test("Should run action when change state", function() {
    var automa = new Automa(STATE.S1);
    var executed = false;
    automa.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDo(function() { executed = true; });
    automa.signal(EVENT.E1);
    ok(executed === true, "Action executed");
});

test("Should change state", function() {
    var automa = new Automa(STATE.S1);
    var executed1 = false;
    var executed2 = false;
    automa.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDo(function() { executed1 = true; });
    automa.stayOn(STATE.S2).when(EVENT.E1).andDo(function() { executed2 = true; });
    automa.signal(EVENT.E1);
    automa.signal(EVENT.E1);
    ok(executed1 === true, "Action 1 executed");
    ok(executed2 === true, "Action 2 executed");
});

test("Should remain on same state", function() {
    var automa = new Automa(STATE.S1);
    var executed = 0;
    automa.stayOn(STATE.S1).when(EVENT.E1).andDo(function() { executed++; });
    automa.signal(EVENT.E1);
    automa.signal(EVENT.E1);
    equal(executed, 2, "Action executed twice");
});

test("Should distinguish between events", function() {
    var automa = new Automa(STATE.S1);
    var executed1 = false;
    var executed2 = false;
    automa.stayOn(STATE.S1).when(EVENT.E1).andDo(function() { executed1 = true; });
    automa.stayOn(STATE.S1).when(EVENT.E2).andDo(function() { executed2 = true; });
    automa.signal(EVENT.E1);
    automa.signal(EVENT.E2);
    ok(executed1 === true, "Action 1 executed");
    ok(executed2 === true, "Action 2 executed");
});

test("Should be able to do nothing", function() {
    var automa = new Automa(STATE.S1);
    var executed = false;
    automa.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDoNothing();
    automa.stayOn(STATE.S2).when(EVENT.E1).andDo(function() { executed = true; });
    automa.signal(EVENT.E1);
    automa.signal(EVENT.E1);
    ok(executed === true, "Action executed");
});

test("Should queue up actions in case of nested signalling", function() {
    var automa = new Automa(STATE.S1);
    var executed = false;
    automa.stayOn(STATE.S1).when(EVENT.E2).andDo(function() { throw "Action not queued up"; });
    automa.stayOn(STATE.S2).when(EVENT.E2).andDo(function() { executed = true; });
    automa.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDo(function() { automa.signal(EVENT.E2); });
    automa.signal(EVENT.E1);
    ok(executed === true, "Action executed");
});

test("Should propagate events to the sub-state machine", function() {
    var parentAutoma = new Automa(STATE.S1);
    var childAutoma = new Automa(SUB_STATE.SS1);
    var parentExecuted = false;
    var childExecuted = false;
    
    parentAutoma.addChild(STATE.S1, childAutoma);
    parentAutoma.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDo(function() { parentExecuted = true; });
    childAutoma.from(SUB_STATE.SS1).goTo(SUB_STATE.SS2).when(EVENT.E1).andDo(function() { childExecuted = true; });
    parentAutoma.signal(EVENT.E1);
    
    ok(childExecuted === true, "Action executed by the child state machine");
    ok(parentExecuted === false, "Action not executed by the parent state machine");
});


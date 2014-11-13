STATE = {
    S1 : "State 1",
    S2 : "State 2"
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
    ok(executed === true, "Action not executed");
});

test("Should ignore irrelevant events", function() {
    var automa = new Automa(STATE.S1);
    automa.signal(EVENT.E1);
    expect(0);
});

test("Should run action when change state", function() {
    var automa = new Automa(STATE.S1);
    var executed = false;
    automa.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDo(function() { executed = true; });
    automa.signal(EVENT.E1);
    ok(executed === true, "Action not executed");
});

test("Should change state", function() {
    var automa = new Automa(STATE.S1);
    var executed1 = false;
    var executed2 = false;
    automa.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDo(function() { executed1 = true; });
    automa.stayOn(STATE.S2).when(EVENT.E1).andDo(function() { executed2 = true; });
    automa.signal(EVENT.E1);
    automa.signal(EVENT.E1);
    ok(executed1 === true, "Action 1 not executed");
    ok(executed2 === true, "Action 2 not executed");
});

test("Should remain on same state", function() {
    var automa = new Automa(STATE.S1);
    var executed = 0;
    automa.stayOn(STATE.S1).when(EVENT.E1).andDo(function() { executed++; });
    automa.signal(EVENT.E1);
    automa.signal(EVENT.E1);
    equal(executed, 2, "Action not executed 2 times");
});

test("Should distinguish between events", function() {
    var automa = new Automa(STATE.S1);
    var executed1 = false;
    var executed2 = false;
    automa.stayOn(STATE.S1).when(EVENT.E1).andDo(function() { executed1 = true; });
    automa.stayOn(STATE.S1).when(EVENT.E2).andDo(function() { executed2 = true; });
    automa.signal(EVENT.E1);
    automa.signal(EVENT.E2);
    ok(executed1 === true, "Action 1 not executed");
    ok(executed2 === true, "Action 2 not executed");
});

test("Should be able to do nothing", function() {
    var automa = new Automa(STATE.S1);
    var executed = false;
    automa.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDoNothing();
    automa.stayOn(STATE.S2).when(EVENT.E1).andDo(function() { executed = true; });
    automa.signal(EVENT.E1);
    automa.signal(EVENT.E1);
    ok(executed === true, "Action not executed");
});

test("Should queue up actions in case of nested signalling", function() {
    var automa = new Automa(STATE.S1);
    var executed = false;
    automa.stayOn(STATE.S1).when(EVENT.E2).andDo(function() { throw "Action not queued up"; });
    automa.stayOn(STATE.S2).when(EVENT.E2).andDo(function() { executed = true; });
    automa.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDo(function() { automa.signal(EVENT.E2); });
    automa.signal(EVENT.E1);
    ok(executed === true, "Action not executed");
});


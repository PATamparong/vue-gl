describe("VglRenderer component", function() {
    const {VglRenderer, VglNamespace} = VueGL;
    const assert = chai.assert;
    const webgl = (() => {
        const canvas = document.createElement("canvas");
        const opts = {
            antialias: true,
            premultipliedAlpha: false,
            depth: false
        };
        try {
            return canvas.getContext("webgl", opts) || canvas.getContext("experimental-webgl", opts);
        } catch(e) {}
        return false;
    })();
    let pvm;
    if (!webgl) {
        console.log("WebGL is not supported. Skip tests for the VglRenderer.");
    } else {
        pvm = new Vue(VglRenderer).$mount();
    }
    beforeEach(function() {
        // Skip all tests when the WebGL is not supported.
        /*if (!webgl)*/ this.skip();
    });
    describe("Namespace injection", function() {
        describe("Should be able to access vglCameras", function() {
            it("When the component is the root namespace.", function() {
                assert.isObject(pvm.vglCameras);
            });
            it("When the component is a descendant of the other namespace.", function() {
                const vm = new Vue({
                    template: `<vgl-namespace><vgl-renderer ref="renderer" /></vgl-namespace>`,
                    components: {
                        VglNamespace,
                        VglRenderer
                    }
                }).$mount();
                assert.isObject(vm.$refs.renderer.vglCameras);
            });
        });
        describe("Should be able to access vglScenes", function() {
            it("When the component is the root namespace.", function() {
                assert.isObject(pvm.vglScenes);
            });
            it("When the component is a descendant of the other namespace.", function() {
                const vm = new Vue({
                    template: `<vgl-namespace><vgl-renderer ref="renderer" /></vgl-namespace>`,
                    components: {
                        VglNamespace,
                        VglRenderer
                    }
                }).$mount();
                assert.isObject(vm.$refs.renderer.vglScenes);
            });
        });
    });
    describe("Creating a renderer", function() {
        describe("Output canvas", function() {
            it("The domElement property of WebGLRenderer instance should be the Vue created canvas.", function() {
                assert.strictEqual(pvm.$refs.rdr, pvm.inst.domElement);
            });
        });
        describe("Context attributes", function() {
            describe("The alpha property should affect the alpha attribute.", function() {
                it("When the property is undefined (or false).", function() {
                    assert.isFalse(pvm.inst.getContextAttributes().alpha);
                });
                it("When the property is true.", function() {
                    const vm = new (Vue.extend(VglRenderer))({propsData: {alpha: true}}).$mount();
                    assert.isTrue(vm.inst.getContextAttributes().alpha);
                });
            });
            describe("The disableDepth property should affect the depth attribute.", function() {
                const enable = !webgl.getContextAttributes().depth;
                if (!enable) console.log("Depth buffer cannot be disabled. Skip tests for the depth property.");
                beforeEach(function() {
                    if (!enable) this.skip();
                });
                it("When the property is undefined (or false).", function() {
                    assert.isTrue(pvm.inst.getContextAttributes().depth);
                });
                it("When the property is true.", function() {
                    const vm = new (Vue.extend(VglRenderer))({propsData: {disableDepth: true}}).$mount();
                    assert.isFalse(vm.inst.getContextAttributes().depth);
                });
            });
            describe("The disableStencil property should affect the stencil attribute.", function() {
                it("When the property is undefined (or false).", function() {
                    assert.isTrue(pvm.inst.getContextAttributes().stencil);
                });
                it("When the property is true.", function() {
                    const vm = new (Vue.extend(VglRenderer))({propsData: {disableStencil: true}}).$mount();
                    assert.isFalse(vm.inst.getContextAttributes().stencil);
                });
            });
            describe("The antialias property should affect the antialias attribute.", function() {
                const enable = webgl.getContextAttributes().antialias;
                if (!enable) console.log("Antialiasing is not supported. Skip tests for the antialias property.");
                beforeEach(function() {
                    if (!enable) this.skip();
                });
                it("When the property is undefined (or false).", function() {
                    assert.isFalse(pvm.inst.getContextAttributes().antialias);
                });
                it("When the property is true.", function() {
                    const vm = new (Vue.extend(VglRenderer))({propsData: {antialias: true}}).$mount();
                    assert.isTrue(vm.inst.getContextAttributes().antialias);
                });
            });
            describe("The disablePremultipliedAlpha property should affect the premultipliedAlpha attribute.", function() {
                const enable = !webgl.getContextAttributes().premultipliedAlpha;
                if (!enable) console.log("PremultipliedAlpha cannot be disabled. Skip tests for the premultipliedAlpha property.");
                beforeEach(function() {
                    if (!enable) this.skip();
                });
                it("When the property is undefined (or false).", function() {
                    assert.isTrue(pvm.inst.getContextAttributes().premultipliedAlpha);
                });
                it("When the property is true.", function() {
                    const vm = new (Vue.extend(VglRenderer))({propsData: {disablePremultipliedAlpha: true}}).$mount();
                    assert.isFalse(vm.inst.getContextAttributes().premultipliedAlpha);
                });
            });
            describe("The preserveDrawingBuffer property should affect the preserveDrawingBuffer attribute.", function() {
                it("When the property is undefined (or false).", function() {
                    assert.isFalse(pvm.inst.getContextAttributes().preserveDrawingBuffer);
                });
                it("When the property is true.", function() {
                    const vm = new (Vue.extend(VglRenderer))({propsData: {preserveDrawingBuffer: true}}).$mount();
                    assert.isTrue(vm.inst.getContextAttributes().preserveDrawingBuffer);
                });
            });
        });
        describe("Capabilities", function() {
            describe("The logarithmicDepthBuffer property should affect the logarithmicDepthBuffer capability.", function() {
                const ext = webgl.getSupportedExtensions().indexOf("EXT_frag_depth") >= 0;
                if (!ext) console.log("The extension EXT_frag_depth is not supported. Skip tests for the logarithmicDepthBuffer property.");
                beforeEach(function() {
                    if (!ext) this.skip();
                });
                it("When the property is undefined (or false).", function() {
                    assert.isFalse(pvm.inst.capabilities.logarithmicDepthBuffer);
                });
                it("When the property is true.", function() {
                    const vm = new (Vue.extend(VglRenderer))({propsData: {logarithmicDepthBuffer: true}}).$mount();
                    assert.isTrue(vm.inst.capabilities.logarithmicDepthBuffer);
                });
            });
            describe("The precision property should affect the precision capability.", function() {
                it("When the property is undefined (or false).", function() {
                    assert.strictEqual(pvm.inst.capabilities.precision, "highp");
                });
                it("When the property is \"lowp\".", function() {
                    const vm = new (Vue.extend(VglRenderer))({propsData: {precision: "lowp"}}).$mount();
                    assert.strictEqual(vm.inst.capabilities.precision, "lowp");
                });
                it("When the property is \"mediump\".", function() {
                    const vm = new (Vue.extend(VglRenderer))({propsData: {precision: "mediump"}}).$mount();
                    assert.strictEqual(vm.inst.capabilities.precision, "mediump");
                });
                it("When the property is \"highp\".", function() {
                    const vm = new (Vue.extend(VglRenderer))({propsData: {precision: "highp"}}).$mount();
                    assert.strictEqual(vm.inst.capabilities.precision, "highp");
                });
            });
        });
    });
    describe("When any properties are changed", function() {
        describe("Output canvas", function() {
            it("The canvas element should be replaced.", function(done) {
                const vm = new Vue(VglRenderer).$mount();
                const oldCanvas = vm.$refs.rdr;
                vm.alpha = true;
                vm.$nextTick(() => {
                    try {
                        assert.notEqual(oldCanvas, vm.$refs.rdr);
                        done();
                    } catch(e) {
                        done(e);
                    }
                });
            });
            it("The WebGLRenderer instance should be newly created.", function(done) {
                const vm = new Vue(VglRenderer).$mount();
                const oldInst = vm.inst;
                vm.alpha = true;
                vm.$nextTick(() => {
                    try {
                        assert.notEqual(oldInst, vm.inst);
                        done();
                    } catch(e) {
                        done(e);
                    }
                });
            });
            it("The domElement property of WebGLRenderer instance should be the replaced canvas.", function(done) {
                const vm = new Vue(VglRenderer).$mount();
                vm.alpha = true;
                vm.$nextTick(() => {
                    try {
                        assert.strictEqual(vm.inst.domElement, vm.$refs.rdr);
                        done();
                    } catch(e) {
                        done(e);
                    }
                });
            });
        });
    });
});

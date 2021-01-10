import router from "router";
export function index() {
    router.get("/", function (req, res) {
        res.render("/", {});
    });
}

index();

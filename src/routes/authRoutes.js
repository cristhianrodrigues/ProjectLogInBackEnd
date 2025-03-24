import express from "express";
const router = express.Router();
import { registrarUsuario, loginUsuario, validateToken } from "../controllers/authController.js";

router.get('/teste', (req, res) => {
    res.json({ message: "Rotas funcionando!"});
});

router.post('/registrar', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/validate', validateToken);

export default router;
// Admin authorization middleware
function requireAdmin(req, res, next) {
    if (req.session && req.session.userRole === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }
}

module.exports = requireAdmin;

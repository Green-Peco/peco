const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: 'Validation failed',
            details: error.details.map(d => d.message).join(', ')
        });
    }
    next();
};

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const lessonCompletionSchema = Joi.object({
    answers: Joi.array().items(
        Joi.object({
            questionId: Joi.number().integer().required(),
            answerId: Joi.string().required()
        })
    ).optional() // The 'answers' array is optional for non-quiz lessons
});

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    lessonCompletionSchema
};

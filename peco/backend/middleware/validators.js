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
    ).optional()
});

const createPostSchema = Joi.object({
    content: Joi.string().min(1).max(1000).required(),
    media_url: Joi.string().uri().optional().allow(null, ''),
    tags: Joi.array().items(Joi.string().min(1).max(50)).optional().allow(null)
});

const createCommunitySchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional().allow(null, '')
});

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    lessonCompletionSchema,
    createPostSchema,
    createCommunitySchema
};

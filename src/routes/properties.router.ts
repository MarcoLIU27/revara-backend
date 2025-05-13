import express from 'express';
import * as PropertiesController from '../controllers/properties.controller';

const router = express.Router();

// 搜索属性列表
router.get('/search', PropertiesController.searchProperties);

// 获取单个属性详情
router.get('/:id', PropertiesController.getProperty);

export default router; 
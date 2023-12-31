import express from 'express';

import { jwtAuth } from '../controllers/jwtAuth';
import {
  postLogin,
  getLogout,
  postJoin,
  postIdCheck,
  getNav,
  checkLoginState,
  getChatRoomList,
} from '../controllers/userControllers';

const userRouters = express.Router();

userRouters.get('/:userId/chatRoomList', getChatRoomList);
userRouters.post('/login', postLogin);
userRouters.get('/logout', jwtAuth, getLogout);
userRouters.post('/join', postJoin);
userRouters.post('/join/idCheck', postIdCheck);
userRouters.get('/nav', jwtAuth, getNav);
userRouters.get('/checkLogin', jwtAuth, checkLoginState);

export default userRouters;

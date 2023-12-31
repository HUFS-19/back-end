import db from '../db';
import mysql from 'mysql';

const setImgUrl = (file) => {
  if (process.env.NODE_ENV === 'prod') {
    console.log(file.location, '<<prod>>');
    return file.location;
  } else {
    console.log('<<dev>>');
    console.log(file);
    return 'http://localhost:5000/' + file.destination + file.filename;
  }
};

export const getProfileInfo = (req, res) => {
  const userId = req.params.userId;

  let login = { isLogin: false, id: '' };
  if (req.user) {
    login.isLogin = true;
    login.id = req.user.id;
  }

  let profileSql = 'select * from userinfo where userID = ? ; ';
  profileSql = mysql.format(profileSql, userId);

  let snsSql =
    'select snsTYPE, snsLINK from snsinfo where userID = ? order by snsTYPE;';
  snsSql = mysql.format(snsSql, userId);

  db.query(profileSql + snsSql, (err, results) => {
    if (err) {
      console.log(err);
    }
    try {
      let sns = results[1];
      let profile = results[0][0];
      //sns 객체 가공
      sns = sns.map((data) => {
        return Object.values(data);
      });
      sns = Object.fromEntries(sns);

      res.send({ profileData: profile, snsList: sns, loginState: login });
    } catch (err) {
      console.log(err);
    }
  });
};

export const updateProfileInfo = (req, res) => {
  const userId = req.params.userId;
  const profileData = req.body.profileData;
  const snsData = req.body.snsList;
  console.log(req.body);
  let profileSql =
    'update userInfo set nickname=?, introduce=? where userID = ?;';
  profileSql = mysql.format(profileSql, [
    profileData.nickname,
    profileData.introduce,
    userId,
  ]);

  let snsSql = '';
  Object.keys(snsData).map((snsType) => {
    let updateSql = `insert into usersns(userID, snsID, snsLINK) select ?, snsID, ? from snstype where snstype=?
        on duplicate key update snsLINK = ?;`;
    updateSql = mysql.format(updateSql, [
      userId,
      snsData[snsType],
      snsType,
      snsData[snsType],
    ]);
    snsSql += updateSql;
  });

  db.query(profileSql + snsSql, (err, results) => {
    if (err) {
      console.log(err);
    }
    try {
      res.send({ success: true });
    } catch (err) {
      console.log(err);
    }
  });
};

export const updateUserIcon = (req, res) => {
  const userId = req.params.userId;

  let imgPath = setImgUrl(req.file);

  let userIconSql = `update userInfo set userIcon = ? where userID = ?;`;
  userIconSql = mysql.format(userIconSql, [imgPath, userId]);

  db.query(userIconSql, (err, results) => {
    if (err) {
      console.log(err);
    }
    try {
      res.send({ success: true });
    } catch (err) {
      console.log(err);
    }
  });
};

export const deleteSns = (req, res) => {
  const userId = req.params.userId;
  const deletedLink = req.body;

  let deleteSql = '';
  deletedLink.map((data) => {
    deleteSql += `delete from Usersns where userID = '${userId}' and snsLINK = '${data}';`;
  });

  db.query(deleteSql, (err, results) => {
    if (err) {
      console.log(err);
    }
    try {
      res.send({ success: true });
    } catch (err) {
      console.log(err);
    }
  });
};

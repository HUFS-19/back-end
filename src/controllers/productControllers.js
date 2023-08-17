import db from '../db';

export const getProduct = (req, res) => {
  db.query(
    `select * from product where prodID=${req.params.id}`,
    (error, results) => {
      if (error) {
        console.log(error);
      }

      if (req.user && req.user.id === results[0].userID) {
        results.push({ isUploader: true });
        return res.send(results);
      }

      results.push({ isUploader: false });
      return res.send(results);
    },
  );
};

export const deleteProduct = (req, res) => {
  if (!req.user) {
    return res.status(500).send('No User');
  }

  const prodId = req.params.id;

  db.query(`delete from product where prodID='${prodId}'`, (error, results) => {
    if (error) {
      console.log(error);
    }
  });

  return res.send(`${prodId}번 제품 삭제`);
};

export const putProduct = (req, res) => {
  if (!req.user) {
    return res.status(500).send('No User');
  }

  const prodId = req.params.id;

  const { cateID, prodNAME, detail, link } = req.body;

  db.query(
    `update product set cateID=?, prodNAME=?, detail=?, link=? where prodID=${prodId}`,
    [cateID, prodNAME, detail, link],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
      }

      return res.send('제품 수정 성공');
    },
  );
};

export const getUserProducts = (req, res) => {
  db.query(
    `select * from product where userID='${req.params.userId}'`,
    (error, results) => {
      if (error) {
        console.log(error);
      }
      res.send(results);
    },
  );
};

export const getTags = (req, res) => {
  db.query(
    `select * from tag where prodID=${req.params.id}`,
    (error, results) => {
      if (error) {
        console.log(error);
      }
      res.send(results);
    },
  );
};

export const getImgs = (req, res) => {
  db.query(
    `select * from prodimg where prodID=${req.params.id}`,
    (error, results) => {
      if (error) {
        console.log(error);
      }
      res.send(results);
    },
  );
};

export const getLikeProduct = (req, res) => {
  if (!req.user) {
    res.send({ alert: true });
  } else {
    db.query(
      `select p.* from Product p, UserLike u where u.userID = '${req.user.id}' and p.prodID = u.prodID`,
      (err, results) => {
        try {
          res.send(results);
        } catch (err) {
          console.log('LikeProduct error');
          res.send([]);
        }
      },
    );
  }
};

export const postProduct = (req, res) => {
  if (!req.user) {
    return res.status(500).send('No User');
  }

  const { cateID, prodNAME, detail, link } = req.body;

  db.query(
    `insert into product (userID, cateID, prodNAME, detail, link, Mimg) values ('${req.user.id}', '${cateID}', '${prodNAME}', '${detail}', '${link}', 'src\mimg');`,
    (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
      }
      return res.send([results.insertId]);
    },
  );
};

export const postImgs = (req, res) => {
  if (!req.user) {
    return res.status(500).send('No User');
  }

  const prodId = req.params.id;

  req.files.forEach((file) => {
    const imgID = file.filename.slice(0, 2);
    db.query(
      `insert into prodimg (imgID, prodID, img, imgOrder) values ('${imgID}', '${prodId}', 'src\img', '${parseInt(
        file.originalname,
      )}');`,
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send('Internal Server Error');
        }
      },
    );
  });

  return res.send('이미지 잘 전송!');
};

export const postTags = (req, res) => {
  if (!req.user) {
    return res.status(500).send('No User');
  }

  const prodId = req.params.id;
  const tags = req.body.tags;

  tags.forEach((tag) => {
    db.query(
      `insert into tag (prodID, tagNAME) values ('${prodId}', '${tag}');`,
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send('Internal Server Error');
        }
      },
    );
  });

  return res.send('태그 잘 전송!');
};

export const putImgs = (req, res) => {
  if (!req.user) {
    return res.status(500).send('No User');
  }

  const prodId = req.params.id;
  const tags = req.body.tags;

  // 기존 이미지 삭제
  db.query(`delete from prodImg where prodID='${prodId}'`, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Internal Server Error');
    }
  });

  // 새로운 이미지 추가
  req.files.forEach((file) => {
    const imgID = file.filename.slice(0, 2);
    db.query(
      `insert into prodimg (imgID, prodID, img, imgOrder) values ('${imgID}', '${prodId}', 'src\img', '${parseInt(
        file.originalname,
      )}');`,
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send('Internal Server Error');
        }
      },
    );
  });

  return res.send('이미지 수정 완료');
};

export const putTags = (req, res) => {
  if (!req.user) {
    return res.status(500).send('No User');
  }

  const prodId = req.params.id;
  const tags = req.body.tags;

  // 기존 태그 삭제
  db.query(`delete from tag where prodID='${prodId}'`, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Internal Server Error');
    }
  });

  // 새로운 태그 추가
  tags.forEach((tag) => {
    db.query(
      `insert into tag (prodID, tagNAME) values ('${prodId}', '${tag}');`,
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send('Internal Server Error');
        }
      },
    );
  });

  return res.send('태그 잘 전송!');
};

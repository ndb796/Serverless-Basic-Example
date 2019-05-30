const mongoose = require('mongoose');
const Story = require('../models/Story');

let connection = null;

const connect = () => {
  // 연결 되어있으면 기존것을 연결시키고
  if (connection && mongoose.connection.readyState === 1) return Promise.resolve(connection);
  // 없으면 새로 연결함
  return mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).then(
    conn => {
      connection = conn;
      return connection;
    }
  );
};

const createResponse = (status, body) => ({
  statusCode: status,
  body: JSON.stringify(body)
});

// 스토리 만들기
exports.createStory = (event, ctx, cb) => {
    const { title, body } = JSON.parse(event.body);
    connect().then(
      () => {
        const story = new Story({ title, body });
        return story.save();
      }
    ).then(
      story => {
        ctx.done(null, createResponse(200, story));
      }
    ).catch(
      e => cb(e)
    );
};

// 여러개의 스토리 리스팅
exports.readStories = (event, ctx, cb) => {
    connect().then(
      // 역순으로, 최대 20개 리스팅
      () => Story.find().sort({ _id: -1 }).limit(20).lean().exec()
    ).then(
      stories => ctx.done(null, createResponse(200, stories))
    );
};

// 특정 스토리 읽기
exports.readStory = (event, ctx, cb) => {
    connect().then(
      // 역순으로, 최대 20개 리스팅
      () => Story.findById(event.pathParameters.id).exec()
    ).then(
      story => {
        if (!story) {
          return ctx.done(null, { statusCode: 404 });
        }
        ctx.done(null, createResponse(200, story));
      }
    );
};

// 스토리 수정
exports.updateStory = (event, ctx, cb) => {
    const update = JSON.parse(event.body);
    connect().then(
      // id 로 찾아서 업데이트
      () => Story.findOneAndUpdate({ _id: event.pathParameters.id }, update, { new: true }).exec()
    ).then(
      story => {
        if (!story) {
          return ctx.done(null, { statusCode: 404 });
        }
        ctx.done(null, createResponse(200, story));
      }
    );
};

// 스토리 삭제
exports.deleteStory = (event, ctx, cb) => {
    connect().then(
      // 역순으로, 최대 20개 리스팅
      () => Story.remove({ _id: event.pathParameters.id }).exec()
    ).then(
      () => ctx.done(null, createResponse(204, null))
    );
};
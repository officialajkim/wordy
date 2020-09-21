const pauseResumeSubRouter = require('express').Router();
const fetch = require('node-fetch');

pauseResumeSubRouter.get('/type/:type/with_subID_and_token/:subscription/:token', async (req, res) => {
  const token = req.params.token;
  const user_chosen = req.params.type === 'pause' ? 'pause' : 'resume'; // resume is the default.

  // Language
  const pause_resume_type = {
    'pause': {
      'formal': 'suspend',
      'past': 'paused'
    },
    'resume': {
      'formal': 'activate',
      'past': 'resumed'
    }
  };
  const type = pause_resume_type[user_chosen].formal;

  const url = `https://api.sandbox.paypal.com/v1/billing/subscriptions/${req.params.subscription}/${type}`;
  const data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "reason": 'User deactivated the sub.'
    })
  });

  let message, status = "";
  if(data.status === 204) {
    status = "success"
    message=`Subscription Successfully ${pause_resume_type[user_chosen].past}`
  } else if (data.status === 422) { 
    status = "warning"
    message=`It has been already ${pause_resume_type[user_chosen].past}.`
  } else {
    status = "error",
    message = "Unknown error. Figure it out."
  }
  res.send({
    status,
    message
  });
})

module.exports = pauseResumeSubRouter;
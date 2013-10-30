var PingConsumer = Oasis.Consumer.extend({
  events: {
    ping: function() {
      console.log('consumer ping');
      this.send('pong');
    }
  }
});

oasis.connect({
  consumers: {
    ping: PingConsumer
  }
})
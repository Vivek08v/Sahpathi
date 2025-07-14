import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  listenIp: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
  listenPort: process.env.PORT || 5000,
  sslCrt: process.env.SSL_CRT_FILEPATH || '',
  sslKey: process.env.SSL_KEY_FILEPATH || '',
  
  mediasoup: {
    // Worker settings
    worker: {
      rtcMinPort: Number(process.env.MEDIASOUP_MIN_PORT) || 10000,
      rtcMaxPort: Number(process.env.MEDIASOUP_MAX_PORT) || 10100,
      logLevel: 'warn',
      logTags: [
        'info',
        'ice',
        'dtls',
        'rtp',
        'srtp',
        'rtcp',
      ],
    },
    // Router settings
    router: {
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {
            'x-google-start-bitrate': 1000,
          },
        },
        {
          kind: 'video',
          mimeType: 'video/VP9',
          clockRate: 90000,
          parameters: {
            'profile-id': 2,
            'x-google-start-bitrate': 1000,
          },
        },
        {
          kind: 'video',
          mimeType: 'video/h264',
          clockRate: 90000,
          parameters: {
            'packetization-mode': 1,
            'profile-level-id': '4d0032',
            'level-asymmetry-allowed': 1,
            'x-google-start-bitrate': 1000,
          },
        },
      ],
    },
    // WebRtcTransport settings
    webRtcTransport: {
      listenIps: [
        {
          ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
          announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || '127.0.0.1',
        }
      ],
      maxIncomingBitrate: 1500000,
      initialAvailableOutgoingBitrate: 1000000,
    }
  }
}; 
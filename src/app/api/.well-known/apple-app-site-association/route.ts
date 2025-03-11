import { NextResponse } from 'next/server'

const association = {
  applinks: {
    apps: [],
    details: [
      {
        appID: 'EH2N5ZJEGB.com.samsung.smartthings.partnertestapp',
        paths: ['/bridge*'],
      },
      {
        appID: 'EH2N5ZJEGB.com.smartthings.us.*',
        paths: ['/bridge*'],
      },
      {
        appID: 'EH2N5ZJEGB.com.samsung.us.*',
        paths: ['/bridge*'],
      },
      {
        appID: 'EH2N5ZJEGB.com.samsung.us.oneconnect4ios.develop',
        paths: ['/bridge*'],
      },
      {
        appID: 'X3M3P7J4X7.com.samsung.oneconnect4ios.smartthings.alpha',
        paths: ['/bridge*'],
      },
      {
        appID: 'ZL5R24NUNH.com.samsung.oneconnect4ios.smartthings.develop',
        paths: ['/bridge*'],
      },
      {
        appID: 'ZL5R24NUNH.com.samsung.cn.oneconnect4ios.smartthings.develop',
        paths: ['/bridge*'],
      },
      {
        appID: 'W97542493Y.com.samsung.srbdprofile.oneconnect4ios.develop',
        paths: ['/bridge*'],
      },
      {
        appID: 'Y8W72N989Q.com.samsung.msvc.oneconnect4ios.develop',
        paths: ['/bridge*'],
      },
      {
        appID: '9BA8G3LBM6.com.samsung.vd.oneconnect4ios.develop',
        paths: ['/bridge*'],
      },
      {
        appID: 'X3M3P7J4X7.com.samsung.oneconnect4ios.smartthings.debug',
        paths: ['/bridge*'],
      },
      {
        appID: '254B9J7846.com.samsung.oneconnect4iosX',
        paths: ['/bridge*'],
      },
      {
        appID: '254B9J7846.com.samsung.cn.oneconnect4iosX',
        paths: ['/bridge*'],
      },
      {
        appID: '8S33FS7Q5Q.com.samsung.oneconnect4ios',
        paths: ['/bridge*'],
      },
      {
        appID: '8S33FS7Q5Q.com.samsung.cn.oneconnect4ios',
        paths: ['/bridge*'],
      },
    ],
  },
}

export async function GET() {
  return NextResponse.json(association)
}

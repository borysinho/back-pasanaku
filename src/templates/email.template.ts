export const templateEMail = (
  nombre_juego: string,
  linkApp: string
): string => {
  return `<!DOCTYPE html>
  <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
  
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
      * {
        box-sizing: border-box;
      }
  
      body {
        margin: 0;
        padding: 0;
      }
  
   
  
   
  
      p {
        line-height: inherit
      }
  
   
  
      .image_block img+div {
        display: none;
      }
  
      @media (max-width:700px) {
        .desktop_hide table.icons-outer {
          display: inline-table !important;
        }
  
        .desktop_hide table.icons-inner {
          display: inline-block !important;
        }
  
        .icons-inner {
          text-align: center;
        }
  
        .icons-inner td {
          margin: 0 auto;
        }
  
        .image_block div.fullWidth {
          max-width: 100% !important;
        }
  
        .mobile_hide {
          display: none;
        }
  
        .row-content {
          width: 100% !important;
        }
  
        .stack .column {
          width: 100%;
          display: block;
        }
  
        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0px;
        }
  
    
  
        .row-6 .column-1 .block-2.paragraph_block td.pad>div,
        .row-6 .column-1 .block-3.paragraph_block td.pad>div,
        .row-7 .column-1 .block-7.paragraph_block td.pad>div {
          text-align: center !important;
        }
  
        .row-5 .column-1 {
          padding: 5px 0 !important;
        }
      }
    </style>
  </head>
  
  <body style="background-color: #f2f3fa; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
    <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="  background-color: #f2f3fa;">
      <tbody>
        <tr>
          <td>
            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style=" background-color: #f2f3fa;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style=" color: #000000; width: 680px; margin: 0 auto;" width="680">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style=" font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <div class="spacer_block block-1" style="height:50px;line-height:50px;font-size:1px;">&#8202;</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
        
            <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style=" background-color: #ffffff; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="16.666666666666668%" style=" font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <div class="spacer_block block-1" style="height:1px;line-height:1px;font-size:1px;">&#8202;</div>
                          </td>
                          <td class="column column-2" width="66.66666666666667%" style=" font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="">
                              <tr>
                                <td class="pad">
                                  <h1 style="margin: 0; color: #1a1c24; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0; "><span class="tinyMce-placeholder">¡Felicidades! Has sido invitado a Pasanaku<br></span></h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td class="column column-3" width="16.666666666666668%" style=" font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <div class="spacer_block block-1" style="height:1px;line-height:1px;font-size:1px;">&#8202;</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style=" background-color: #ffffff; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style=" font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style=" word-break: break-word;">
                              <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:60px;padding-right:60px;padding-top:10px;">
                                  <div style="color:#3f424e;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:22px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;">
                                    <p style="margin: 0;">Diviértete mientras ahorras con el juego comunitario Pasanaku.</p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style=" border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style=" font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <div class="spacer_block block-1" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style=" word-break: break-word;">
                              <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:25px;padding-right:25px;padding-top:10px;">
                                  <div style="color:#9e9fa0;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;">
                                    <p style="margin: 0; margin-bottom: 18px;">&nbsp;</p>
                                    <p style="margin: 0; margin-bottom: 18px;">Has recibido este correo de notificación porque reciéntemente te han invitado al juego ${nombre_juego} de Pasanaku.</p>
                                    <p style="margin: 0;">&nbsp;</p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style=" word-break: break-word;">
                              <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:25px;padding-right:25px;padding-top:10px;">
                                  <div style="color:#9e9fa0;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;">
                                    <p style="margin: 0; margin-bottom: 18px;">Para descargar la App ingresa al siguiente link:</p>
                                    <a href="${linkApp}" target="_self" style="text-decoration: none;">${linkApp}</a>
                                    <p style="margin: 0; margin-bottom: 18px;">o escanea el QR</p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style=" border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style=" font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <div class="spacer_block block-1" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
                            <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="">
                              <tr>
                                <td class="pad" style="width:100%;">
                                  <div class="alignment" align="center" style="line-height:10px">
                                    <div style="max-width: 180px;"><img src="https://i.ibb.co/KwkCD1v/qr-little.png" style="display: block; height: auto; border: 0; width: 100%;" width="180" alt="I'm an image" title="I'm an image" height="auto"></div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <div class="spacer_block block-3" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
                            <table class="divider_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="">
                              <tr>
                                <td class="pad">
                                  <div class="alignment" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="">
                                      <tr>
                                        <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #9E9FA0;"><span>&#8202;</span></td>
                                      </tr>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </table>
                           
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          
          </td>
        </tr>
      </tbody>
    </table><!-- End -->
  </body>
  
  </html>`;
};

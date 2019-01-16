/**
 * Copyright (c) 2008-2017 Regents of the University of California (Regents).
 * Created by WISE, Graduate School of Education, University of California, Berkeley.
 *
 * This software is distributed under the GNU General Public License, v3,
 * or (at your option) any later version.
 *
 * Permission is hereby granted, without written agreement and without license
 * or royalty fees, to use, copy, modify, and distribute this software and its
 * documentation for any purpose, provided that the above copyright notice and
 * the following two paragraphs appear in all copies of this software.
 *
 * REGENTS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE. THE SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED
 * HEREUNDER IS PROVIDED "AS IS". REGENTS HAS NO OBLIGATION TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 *
 * IN NO EVENT SHALL REGENTS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT,
 * SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS,
 * ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * REGENTS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package org.wise.portal.presentation.web.filters;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.transaction.annotation.Transactional;
import org.wise.portal.domain.authentication.MutableUserDetails;
import org.wise.portal.domain.user.User;
import org.wise.portal.presentation.web.controllers.ControllerUtil;
import org.wise.portal.service.user.UserService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

/**
 * Handles failed authentication attempts
 * @author Hiroki Terashima
 */
public class WISEAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

  @Autowired
  private UserService userService;

  public static final Integer recentFailedLoginTimeLimit = 15;

  public static final Integer recentFailedLoginAttemptsLimit = 5;

  private String authenticationFailureUrl;

  /**
   * The user has failed to log in because they either entered
   * an incorrect password or an incorrect ReCaptcha text. We will
   * increment the counter that keeps track of the number of times
   * they have failed to log in within the last 15 minutes.
   * @param request
   * @param response
   */
  @Override
  @Transactional
  public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException exception) throws IOException, ServletException {
    String userName = request.getParameter("username");
    if (userName != null) {
      User user = userService.retrieveUserByUsername(userName);
      if (user != null) {
        MutableUserDetails userDetails = user.getUserDetails();
        Date recentFailedLoginTime = userDetails.getRecentFailedLoginTime();
        Date currentTime = new Date();
        Integer numberOfRecentFailedLoginAttempts = 1;
        if (recentFailedLoginTime != null) {
          long timeDifference = currentTime.getTime() - recentFailedLoginTime.getTime();

          /*
           * check if the time difference is less than 15 minutes. if the time difference
           * is less than 15 minutes we will increment the failed attempts counter.
           * if the difference is greater than 15 minutes we will reset the counter.
           */
          if (timeDifference < (recentFailedLoginTimeLimit * 60 * 1000)) {
            numberOfRecentFailedLoginAttempts =
                userDetails.getNumberOfRecentFailedLoginAttempts() + 1;
          }
        }
        userDetails.setNumberOfRecentFailedLoginAttempts(numberOfRecentFailedLoginAttempts);
        userDetails.setRecentFailedLoginTime(currentTime);
        userService.updateUser(user);
      }
    } else if (request.getServletPath().contains("google-login")) {
      String contextPath = request.getContextPath();
      response.sendRedirect(contextPath + "/login/googleUserNotFound");
      return;
    }

    if (this.isNewSite(request)) {
      JSONObject responseJSON = new JSONObject();
      try {
        responseJSON.put("status", "failure");
        boolean isReCaptchaRequired = ControllerUtil.isReCaptchaRequired(request);
        if (isReCaptchaRequired) {
          responseJSON.put("requireRecaptcha", true);
          String contextPath = request.getContextPath();
          response.sendRedirect(contextPath + "/login/recaptcha");
          return;
        } else {
          String contextPath = request.getContextPath();
          response.sendRedirect(contextPath + "/login");
        }
        response.getWriter().write(responseJSON.toString());
      } catch (JSONException e) {
      }
    } else {
      setDefaultFailureUrl(determineFailureUrl(request, response, exception));
      super.onAuthenticationFailure(request, response, exception);
    }
  }

  private boolean isNewSite(HttpServletRequest request) {
    request.getHeader("referer")
    String site = request.getParameter("site");
    return "new".equals(site);
  }

  /**
   * Get the failure url. This function checks if the public and private
   * keys for the captcha have been provided and if the user has failed
   * to log in 5 or more times in the last 15 minutes. If so, it will
   * require the failure url page to display a captcha.
   */
  protected String determineFailureUrl(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException failed) {
    String url = authenticationFailureUrl;
    String failedMessage = failed.getMessage();
    boolean isReCaptchaRequired = ControllerUtil.isReCaptchaRequired(request);
    if (isReCaptchaRequired) {
      if (failedMessage.equals("Please verify that you are not a robot.")) {
        url = authenticationFailureUrl + "&requireCaptcha=true&reCaptchaFailed=true";
      }  else {
        url = authenticationFailureUrl + "&requireCaptcha=true";
      }
    }
    return url;
  }

  public void setUserService(UserService userService) {
    this.userService = userService;
  }

  public void setAuthenticationFailureUrl(String authenticationFailureUrl) {
    this.authenticationFailureUrl = authenticationFailureUrl;
  }
}

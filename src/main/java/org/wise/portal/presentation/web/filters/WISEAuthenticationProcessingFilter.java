/**
 * Copyright (c) 2007-2017 Regents of the University of California (Regents).
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

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Date;
import java.util.HashMap;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.wise.portal.domain.authentication.MutableUserDetails;
import org.wise.portal.domain.user.User;
import org.wise.portal.presentation.web.controllers.ControllerUtil;
import org.wise.portal.presentation.web.listeners.WISESessionListener;
import org.wise.portal.service.user.UserService;

import net.tanesha.recaptcha.ReCaptcha;
import net.tanesha.recaptcha.ReCaptchaFactory;

/**
 * Custom AuthenticationProcessingFilter that subclasses Acegi Security. This
 * filter upon successful authentication will retrieve a <code>User</code> and
 * put it into the http session.
 *
 * @author Hiroki Terashima
 * @author Geoffrey Kwan
 */
public class WISEAuthenticationProcessingFilter extends UsernamePasswordAuthenticationFilter {

  @Autowired
  protected UserService userService;

  @Autowired
  private Properties wiseProperties;

  public static final String STUDENT_DEFAULT_TARGET_PATH = "/legacy/student";
  public static final String TEACHER_DEFAULT_TARGET_PATH = "/legacy/teacher";
  public static final String ADMIN_DEFAULT_TARGET_PATH = "/admin";
  public static final String RESEARCHER_DEFAULT_TARGET_PATH = "/legacy/teacher";  // TODO eventually researcher will have their own page...
  public static final String LOGIN_DISABLED_MESSGE_PAGE = "/pages/maintenance.html";

  public static final Integer recentFailedLoginTimeLimit = 15;
  public static final Integer recentFailedLoginAttemptsLimit = 5;

  private static final Log LOGGER = LogFactory.getLog(WISEAuthenticationProcessingFilter.class);

  /**
   * Check if the user is required to enter ReCaptcha text. If the
   * user is required to enter ReCaptcha text we will check if the
   * user has entered the correct ReCaptcha text. If ReCaptcha is
   * not required or if the ReCaptcha has been entered correctly,
   * continue on with the authentication process.
   */
  @Override
  public Authentication attemptAuthentication(HttpServletRequest request,
      HttpServletResponse response) throws AuthenticationException {
    if (ControllerUtil.isReCaptchaRequired(request)) {
      if (!isReCaptchaResponseValid(request)) {
        String errorMessage = "Please verify that you are not a robot.";
        try {
          unsuccessfulAuthentication(request, response, new AuthenticationException(errorMessage) {});
        } catch (IOException e) {

        } catch (ServletException e) {

        }
        return null;
      }
    }
    return super.attemptAuthentication(request, response);
  }

  /**
   * Check if the user has entered the correct text for ReCaptcha
   * @return whether the user has entered the correct text for ReCaptcha
   */
  protected boolean isReCaptchaResponseValid(HttpServletRequest request) {
    Boolean result = false;
    String reCaptchaPublicKey = wiseProperties.getProperty("recaptcha_public_key");
    String reCaptchaPrivateKey = wiseProperties.getProperty("recaptcha_private_key");
    String gRecaptchaResponse = request.getParameter("g-recaptcha-response");
    if (ControllerUtil.checkReCaptchaResponse(reCaptchaPrivateKey, reCaptchaPublicKey, gRecaptchaResponse)) {
      result = true;
    }
    return result;
  }

  @Override
  protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
      FilterChain chain, Authentication authentication) throws IOException, ServletException {
    HttpSession session = request.getSession();

    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    User user = userService.retrieveUser(userDetails);
    session.setAttribute(User.CURRENT_USER_SESSION_KEY, user);

    if (LOGGER.isDebugEnabled()) {
      LOGGER.debug("UserDetails logging in: " + userDetails.getUsername());
    }

    String sessionId = session.getId();
    HashMap<String, User> allLoggedInUsers =
        (HashMap<String, User>) session.getServletContext().getAttribute("allLoggedInUsers");
    if (allLoggedInUsers == null) {
      allLoggedInUsers = new HashMap<String, User>();
      session.getServletContext()
          .setAttribute(WISESessionListener.ALL_LOGGED_IN_USERS, allLoggedInUsers);
    }
    allLoggedInUsers.put(sessionId, user);
    super.successfulAuthentication(request, response, chain, authentication);
  }

  @Override
  protected void unsuccessfulAuthentication(HttpServletRequest request,
      HttpServletResponse response, AuthenticationException failed)
    throws IOException, ServletException {
    super.unsuccessfulAuthentication(request, response, failed);
  }
}

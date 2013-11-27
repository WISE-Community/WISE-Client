package org.wise.portal.domain.admin;

import java.util.Date;
import java.util.List;


import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.wise.portal.dao.offering.RunDao;
import org.wise.portal.dao.portal.PortalStatisticsDao;
import org.wise.portal.dao.project.ProjectDao;
import org.wise.portal.dao.user.UserDao;
import org.wise.portal.domain.authentication.MutableUserDetails;
import org.wise.portal.domain.authentication.impl.StudentUserDetails;
import org.wise.portal.domain.authentication.impl.TeacherUserDetails;
import org.wise.portal.domain.portal.PortalStatistics;
import org.wise.portal.domain.portal.impl.PortalStatisticsImpl;
import org.wise.portal.domain.project.Project;
import org.wise.portal.domain.run.Run;
import org.wise.portal.domain.user.User;

public class DailyAdminJob extends QuartzJobBean {

	private RunDao<Run> runDao;
	
	private UserDao<User> userDao;
	
	private ProjectDao<Project> projectDao;
	
	private PortalStatisticsDao<PortalStatistics> portalStatisticsDao;
	
	private boolean DEBUG = false;
	
	/**
	 * 
	 * @see org.springframework.scheduling.quartz.QuartzJobBean#executeInternal(org.quartz.JobExecutionContext)
	 */
	@Override
	protected void executeInternal(JobExecutionContext arg0) throws JobExecutionException {
		
		//query for the portal statistics and save a new row in the portalStatistics table
		gatherPortalStatistics();
	}
	
	/**
	 * query for the portal statistics and save a new row in the portalStatistics table
	 */
	private void gatherPortalStatistics() {
		debugOutput("gatherPortalStatistics start");
		
		//get all the students
		List<User> allStudents = userDao.retrieveByField(null, null, null, "studentUserDetails");
		long totalNumberStudents = allStudents.size();
		debugOutput("Number of students: " + totalNumberStudents);
		
		//get all the teachers
		List<User> allTeachers = userDao.retrieveByField(null, null, null, "teacherUserDetails");
		long totalNumberTeachers = allTeachers.size();
		debugOutput("Number of teachers: " + totalNumberTeachers);
		
		//get the number of student logins
		long totalNumberStudentLogins = 0;
		for(int x=0; x<allStudents.size(); x++) {
			User user = allStudents.get(x);
			MutableUserDetails userDetails = user.getUserDetails();
			totalNumberStudentLogins += ((StudentUserDetails) userDetails).getNumberOfLogins();
		}
		debugOutput("Number of student logins: " + totalNumberStudentLogins);
		
		//get the number of teacher logins
		long totalNumberTeacherLogins = 0;
		for(int x=0; x<allTeachers.size(); x++) {
			User user = allTeachers.get(x);
			MutableUserDetails userDetails = user.getUserDetails();
			totalNumberTeacherLogins += ((TeacherUserDetails) userDetails).getNumberOfLogins();
		}
		debugOutput("Number of teacher logins: " + totalNumberTeacherLogins);
		
		//get the number of projects
		List<Project> projectList = projectDao.getList();
		long totalNumberProjects = projectList.size();
		debugOutput("Number of projects: " + totalNumberProjects);
		
		//get the number of runs
		List<Run> runList = runDao.getList();
		long totalNumberRuns = runList.size();
		debugOutput("Number of runs: " + totalNumberRuns);
		
		//get the number of projects run (how many times students have clicked on the "Run Project" button)
		long totalNumberProjectsRun = 0;
		for(int x=0; x<runList.size(); x++) {
			Run run = runList.get(x);
			Integer timesRun = run.getTimesRun();
			
			if(timesRun != null) {
				totalNumberProjectsRun += timesRun;				
			}
		}
		debugOutput("Number of projects run: " + totalNumberProjectsRun);
		
		//create a new portal statistics object and populate it
		PortalStatisticsImpl newPortalStatistics = new PortalStatisticsImpl();
		newPortalStatistics.setTimestamp(new Date());
		newPortalStatistics.setTotalNumberStudents(totalNumberStudents);
		newPortalStatistics.setTotalNumberStudentLogins(totalNumberStudentLogins);
		newPortalStatistics.setTotalNumberTeachers(totalNumberTeachers);
		newPortalStatistics.setTotalNumberTeacherLogins(totalNumberTeacherLogins);
		newPortalStatistics.setTotalNumberProjects(totalNumberProjects);
		newPortalStatistics.setTotalNumberRuns(totalNumberRuns);
		newPortalStatistics.setTotalNumberProjectsRun(totalNumberProjectsRun);
		
		//save the new portal statistics
		portalStatisticsDao.save(newPortalStatistics);
		
		debugOutput("gatherPortalStatistics end");
	}
	
	/**
	 * A function that outputs the string to System.out if DEBUG is true
	 * @param output a String to output to System.out
	 */
	private void debugOutput(String output) {
		if(DEBUG) {
			System.out.println(output);
		}
	}

	/**
	 * @param runDao the runDao to set
	 */
	public void setRunDao(RunDao<Run> runDao) {
		this.runDao = runDao;
	}
	
	/**
	 * @param userDao the userDao to set
	 */
	public void setUserDao(UserDao<User> userDao) {
		this.userDao = userDao;
	}
	
	/**
	 * 
	 * @param projectDao the projectDao to set
	 */
	public void setProjectDao(ProjectDao<Project> projectDao) {
		this.projectDao = projectDao;
	}
	
	/**
	 * 
	 * @param portalStatisticsDao
	 */
	public void setPortalStatisticsDao(
			PortalStatisticsDao<PortalStatistics> portalStatisticsDao) {
		this.portalStatisticsDao = portalStatisticsDao;
	}
}

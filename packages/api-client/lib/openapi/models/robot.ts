/* tslint:disable */
/* eslint-disable */
/**
 * RMF API Server
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.1.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 *
 * @export
 * @interface Robot
 */
export interface Robot {
  /**
   *
   * @type {string}
   * @memberof Robot
   */
  fleet: any;
  /**
   *
   * @type {string}
   * @memberof Robot
   */
  name: any;
  /**
   *
   * @type {RobotState}
   * @memberof Robot
   */
  state: any;
  /**
   *
   * @type {Array&lt;TaskProgress&gt;}
   * @memberof Robot
   */
  tasks?: any;
}

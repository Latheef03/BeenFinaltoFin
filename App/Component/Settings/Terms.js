import React, { Component } from 'react';
import { View, Text, Image, ScrollView ,StatusBar} from 'react-native';
import styles from './styles/TermPolicyStyle';
import { Toolbar } from '../commoncomponent'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'

export default class Terms extends Component {

    static navigationOptions = {
        header: null
    };
    renderRightImgdone() {
        return <View>

            <View style={[stylesFromToolbar.leftIconContainer, { flexDirection: 'row', }]}>
                <View >
                    <Image resizeMode={'stretch'} style={{ width: 20, height: 20 }} />
                </View>
            </View>


        </View>
    }

    render() {
        return (
            <View style={{ flex: 1,marginTop:0,marginBottom:'-3%' }}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />
                <Toolbar {...this.props} centerTitle="Terms & Conditions" rightImgView={this.renderRightImgdone()} />
                <View style={styles.view}>
                    <ScrollView>
                        {/* <Toolbar {...this.props} centerTitle="Terms & Conditions" /> */}
                        <View style={styles.view1}>
                            <Text style={styles.heading}>Welcome to been ! </Text>
                            <Text style={styles.text}>These Terms of Use govern your use of been and provide information about the Service, outlined below. When you create a been account or use been, you agree to these terms.
                            been is a product by Enjam Social Networks Private Limited. These Terms of Use therefore constitutes an agreement between you and Enjam Social Networks Private Limited.
</Text>

                            <Text style={styles.heading}>What We Are</Text>
                            <Text style={styles.text}>Our goal is to help you travel to your hearts content. To do that, we provide a platform through our service that allows its users to share picture, videos or content and connect with other like-minded travellers. The service is made up of the following aspects:</Text>
                            <Text style={styles.bullet}>• People are different, they have different travel interests. We want to help you explore the world and travel to places your heart seeks. So, we built a service that allows you to share your memories through photos, videos or travel content and see the memories shared by other travellers. We build systems that try to understand who and what you and others love, and use that information to help you create, find, join, and share in experiences and memories that matter to you. Part of that is highlighting content, features, offers, and accounts you might be interested in, and offering ways for you to experience our service, based on things you and others do on this service.</Text>
                            <Text style={styles.bullet}>• Travel is all about discovering places, exploring new culture and meeting new people. So, we built a service that allows its users to interact with other travellers around the world and plan their outings, tours or trips together. You understand been is only a platform for making tour plans and you agree that your interactions with others found on or through the Service are solely between you and such organizations and/or individuals. You agree that been shall not be responsible or liable for any loss or damage of any sort incurred as the result of any such dealings.</Text>
                            <Text style={styles.bullet}>• been also enables you to connect with local tour guides around the world who are seeking to provide tours and travel related services. You understand that the local tour guides listed on the service are independent contractors and that the local tour guides are not employees, agents or any sort of representatives of been. You hereby understand and expressly agree that been does not control the quality, timing, legality or any other aspect whatsoever of the services actually delivered by the local tour guide, nor of the integrity, responsibility or any of the actions whatsoever of the guides. We use best efforts to monitor local tour guide profiles, service offerings, actions and reviews, and suspend privileges to any profile not adhering to our policies or terms of use. By using this service, you agree to report any alleged improprieties of any profiles to been immediately.</Text>
                            <Text style={styles.text}>Simply put, our service enables you to share travel content (including pictures, videos or blogs), explore travel content, plan your travel with other like-minded travellers and allows you to connect with local tour guides across the world. </Text>

                            <Text style={styles.heading}>Data Policy</Text>
                            <Text style={styles.text}>Providing our Service requires collecting and using your information. Our Data Policy explains how we collect, use, and share information. It also explains the many ways you can control your information. You must agree to the Data Policy to use been.</Text>

                            <Text style={styles.heading}>Who Can Use been</Text>
                            <Text style={styles.text}>We want our Service to be as open and inclusive as possible, but we also want it to be safe, secure, and in accordance with the law. So, in return for our commitment to provide a safe and secure Service, we require you to make certain commitments to us which are outlined in the following points,</Text>
                            <Text style={styles.bullet}>•	You must be at least 13 years old or the minimum legal age in your country to use been.</Text>
                            <Text style={styles.bullet}>•	You may only use been if you are over the age at which you can provide consent to data processing under the laws of your country</Text>
                            <Text style={styles.bullet}>•	We must not have previously disabled your account for violation of law or any of our policies.</Text>
                            <Text style={styles.bullet}>•	When you create your been account, you must provide us with accurate and complete information.</Text>

                            <Text style={styles.heading}>What You Are Not Allowed To Do</Text>
                            <Text style={styles.text}>Providing a safe and open Service for a broad community requires that we all do our part.</Text>
                            <Text style={styles.bullet}>•	You can't impersonate others or provide inaccurate information.</Text>
                            <Text style={styles.bullet}>•	You can't do anything unlawful, misleading, or fraudulent or for an illegal or unauthorized purpose.</Text>
                            <Text style={styles.bullet}>•	You can't violate (or help or encourage others to violate) these Terms or our policies</Text>
                            <Text style={styles.bullet}>•	You can't do anything to interfere with or impair the intended operation of the Service.</Text>
                            <Text style={styles.bullet}>•	You can't attempt to create accounts or access or collect information in unauthorized ways. This includes creating accounts or collecting information in an automated way without our express permission.</Text>
                            <Text style={styles.bullet}>•	You can't attempt to buy, sell, or transfer any aspect of your account (including your username) or solicit, collect, or use login credentials of other users.</Text>
                            <Text style={styles.bullet}>•	You can't post private or confidential information or do anything that violates someone else's rights, including intellectual property.</Text>
                            <Text style={styles.bullet}>•	You can't use a domain name or URL in your username without our prior written consent.</Text>

                            <Text style={styles.heading}>Permissions You Give to Us</Text>
                            <Text style={styles.text}>We do not claim ownership of your content, but you grant us a license to use it. Nothing is changing about your rights in your content. We do not claim ownership of your content that you post on or through the Service. Instead, when you share, post, or upload content that is covered by intellectual property rights (like photos or videos) on or in connection with our Service, you hereby grant to us a non-exclusive, royalty-free, transferable, sub-licensable, worldwide license to host, use, distribute, modify, run, copy, publicly perform or display, translate, and create derivative works of your content (consistent with your privacy and application settings). You can end this license anytime by deleting your content or account. However, content will continue to appear if you shared it with others and they have not deleted it. You give us the permission to use your username, profile picture, and information about you and actions with accounts, ads, and sponsored content.</Text>

                            <Text style={styles.heading}>Content Removal & Account Termination</Text>
                            <Text style={styles.text}>You have the right to delete any content you have shared in this service and you have the right to terminate or deactivate your account at any point of time, if you feel necessary to. Following termination or deactivation of your account, we may keep your User Content for a reasonable period of time for backup, archival, or audit purposes. Content you delete may persist for a limited period of time in backup copies. If you wish to disable or permanently terminate your account, you can chose do it in the application settings.
                            We can remove any content or information you share on the Service if we believe that it violates these Terms of Use, our policies, or we are permitted or required to do so by law. We can refuse to provide or stop providing all or part of the Service to you (including terminating or disabling your account) immediately to protect our community or services, or if you create risk or legal exposure for us, violate these Terms of Use or our policies, if you repeatedly infringe other people's intellectual property rights, or where we are permitted or required to do so by law. If we take action to disable or terminate your account, we will notify you where appropriate. If you believe your account has been terminated in error, contact us at application’s Help Center.
</Text>
                            <Text style={styles.heading}>Content You Report & Feedback You Provide</Text>
                            <Text style={styles.text}>We value hearing from our users, and are always listening and working hard to provide a safe and secure service to all the users in been. Providing a safe and open Service for a broad community requires that we all put efforts in doing so. You have the right to report any content or an account in this service, in case you find it inappropriate, abusive, unlawful, misleading, fraudulent or vulgar in any manner. When content is reported, we evaluate the content, including the user activity and user history in the service and if it is found that it violates any of our policies or terms of use, the reported content is deleted or the associated account is terminated or disabled based on the severity of the case, which is at sole discretion of been. We value hearing from our users, and are always interested in learning about ways we can make been better in every aspect. If you choose to submit comments, ideas or feedback, you agree that we are free to use them without any restriction or compensation to you. By accepting your submission, been doesn’t waive any rights to use similar or related feedback previously known to been, or developed by its employees, or obtained from sources other than you.</Text>

                            <Text style={styles.heading}>Dealings with Organizations and Individuals</Text>
                            <Text style={styles.text}>You agree that your interactions with organisations and/or individuals found on or through the Service are solely between you and such organizations and/or individuals. You agree that been shall not be responsible or liable for any loss or damage of any sort incurred as the result of any such dealings. If there is a dispute between participants on this service, or between users and any third party, you understand and agree that been is under no obligation to become involved. In the event that you have a dispute with one or more other users, you hereby release been, its officers, employees, agents and successors in rights from claims, demands and damages (actual and consequential) of every kind or nature, known or unknown, suspected and unsuspected, disclosed and undisclosed, arising out of or in any way related to such disputes and / or our service. </Text>

                            <Text style={styles.heading}>Exposure to Content</Text>
                            <Text style={styles.text}>All posts, stories, messages, comments, images, photos, videos and all other materials ("Content") posted on, transmitted through, or linked from been, are the sole responsibility of the person from whom such Content originated. You are entirely responsible for all Content that you upload, or otherwise make available through the service. been does not control and is not responsible for Content made available through the service. You may be exposed to Content that is offensive, indecent, inaccurate, misleading, or otherwise objectionable. You must evaluate and bear all risks associated with the use of any Content. Under no circumstances will been be liable in any way for Content or for any loss or damage of any kind incurred as a result of the use of any Content listed, or otherwise made available via the Service. You acknowledge that been does not pre-screen or approve Content, but that been will have the right (but not the obligation) in its sole discretion to refuse, delete or remove any Content that is available via the Service, for violating these terms of Use or our policies, or for any other reason.</Text>

                            <Text style={styles.heading}>Enlisting As Local Tour Guide</Text>
                            <Text style={styles.text}>Any user is allowed to enrol as a local tour guide in the service, upon which the profile is listed as local tour guide and allows other users to connect with them for any travel services provided. As a condition of your use of been to enlist as a guide you agree that you will not-</Text>
                            <Text style={styles.bullet}>•	violate any laws</Text>
                            <Text style={styles.bullet}>•	be false or misleading</Text>
                            <Text style={styles.bullet}>•	contact anyone who has asked not to be contacted</Text>
                            <Text style={styles.bullet}>•	collect personal data about other users for commercial or unlawful purposes</Text>
                            <Text style={styles.bullet}>•	host, display, upload, modify, publish, transmit, update or share any information that is defamatory, obscene, pornographic, paedophilic, libellous, invasive of another's privacy, hateful, or racially, ethnically objectionable, or disparaging</Text>
                            <Text style={styles.bullet}>•	harvest or otherwise collect information about others, including email addresses, without their consent</Text>
                            <Text style={styles.text}>You agree that we can disable or terminate any account if we believe that it violates these Terms of Use, our policies, or we feel it is necessary to maintain the integrity of the service. </Text>

                            <Text style={styles.heading}>Security</Text>
                            <Text style={styles.text}>The security of our users is an utmost priority for us. While we work to protect the security of your content and account, been can’t guarantee that unauthorized third parties won’t be able to defeat our security measures and gain access. We ask that you keep your password secure and please notify us immediately of any compromise or unauthorized use of your account.</Text>

                            <Text style={styles.heading}>Termination of Services</Text>
                            <Text style={styles.text}>You agree that been, both immediately and without notice has the right to –</Text>
                            <Text style={styles.bullet}>•	Delete or deactivate your account. </Text>
                            <Text style={styles.bullet}>•	Block your email, mobile number or IP address. </Text>
                            <Text style={styles.bullet}>•	Terminate your access to or use of the service (or any part thereof)</Text>
                            <Text style={styles.bullet}>•	Remove and discard any Content within the Service that has violated the Terms</Text>
                            <Text style={styles.bullet}>•	Further, you agree that been shall not be liable to you or any third-party for any termination of your access to the Service and that you will not attempt to use the Service after said termination.</Text>

                            <Text style={styles.heading}>Disclaimers</Text>
                            <Text style={styles.text}>YOU EXPRESSLY AGREE THAT THE USE OF THIS SERVICE IS AT YOUR SOLE RISK. BEEN DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE; NOR DO WE MAKE ANY WARRANTY AS TO THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE, OR AS TO THE ACCURACY, RELIABILITY OR CONTENT OF ANY INFORMATION, SERVICE OR MERCHANDISE PROVIDED THROUGH OUR SERVICE. CONTENT ON OUR SERVICE IS PROVIDED ON AN "AS IS" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF TITLE OR IMPLIED WARRANTIES OF MERCHANTIBILITY OR FITNESS FOR A PARTICULAR PURPOSE.</Text>

                            <Text style={styles.headings}>Indemnity</Text>
                            <Text style={styles.text}>If you use our service, you agree to indemnify and hold harmless Enjam Social Networks Private Limited, their affiliates and their respective officers, directors, employees and agents, from and against any claims, suits, proceedings, disputes, demands, liabilities, damages, losses, costs and expenses, including, without limitation, reasonable legal and accounting fees (including costs of defence of claims, suits or proceedings brought by third parties), in any way related to your access to or use of our Service, your User Content, or your breach of any of these Terms.</Text>

                            <Text style={styles.heading}>Limitations Of Liability</Text>
                            <Text style={styles.text}>To the Maximum extent permitted by law, been shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of this service or from the provision of any tours or tour services through the service. We also don’t control what people and others do or say, and we aren’t responsible for their (or your) actions or conduct (whether online or offline) or content (including unlawful or objectionable content). We also aren’t responsible for services and features offered by other people or companies, even if you access them through our Service. Our responsibility for anything that happens on the Service (also called "liability") is limited as much as the law will allow. If there is an issue with our Service, we can't know what all the possible impacts might be. You agree that we won't be responsible ("liable") for any lost profits, revenues, information, or data, or consequential, special, indirect, exemplary, punitive, or incidental damages arising out of or related to these Terms, even if we know they are possible. This includes when we delete your content, information, or account.</Text>

                            <Text style={styles.heading}>Disputes, Governing Law And Jurisdiction</Text>
                            <Text style={styles.text}>For any dispute you have with been, you agree to first contact us and try to resolve the dispute with us informally. If we need to contact you, we will do so at the email address on your been account. If been hasn’t been able to resolve the dispute with you informally, we each agree that any claim, dispute, or controversy (excluding claims for injunctive or other equitable relief) arising out of or in connection with or relating to these Terms is subject to the exclusive jurisdiction of the Indian Courts at Bangalore only. Any claim relating to been shall be governed by the Indian Judiciary Laws without regard to its conflict of law provisions. </Text>

                            <Text style={styles.heading}>How we make amendments to these Terms</Text>
                            <Text style={styles.text}>We may change our Service and policies, and we may need to make changes to these Terms so that they accurately reflect our Service and policies. Unless otherwise required by law, we will notify you (for example, through our Service) before we make any major changes to these Terms and give you an opportunity to review them before they go into effect. Then, if you continue to use the Service, you will be bound by the updated Terms. If you do not want to agree to these or any updated Terms, you can delete your account. We reserve the right to determine the form and means of providing notifications to you, and you agree to receive legal notices electronically if that’s what we decide.</Text>

                            <Text style={styles.heading}>Contact us:</Text>
                            <Text style={styles.contact}>If you have any general questions regarding the terms of use, please contact us at support@beenofficial.com.</Text>
                        </View>
                    </ScrollView>

                </View>
            </View>
        )
    }

}
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView,StatusBar } from 'react-native';
import styles from './styles/TermPolicyStyle';
import { Toolbar } from '../commoncomponent'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'

export default class DataPolicy extends Component {

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
            <View style={{ flex: 1 ,marginTop:0,marginBottom:'-3%'}}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content'/> 
                <Toolbar {...this.props} centerTitle="Data Policy" rightImgView={this.renderRightImgdone()} />
                <View style={styles.view}>
                    <ScrollView>
                        <View style={styles.view1}>
                            <Text style={styles.text}>Our mission is to help you discover and do what you love - travel. To do that, we show you personalized content and ads we think you’ll be interested in based on information we collect from you and third parties. We only use that information where we have a proper legal basis for doing so. Hence, we write this Privacy Policy to outline our practices with respect to collecting, using and disclosing your information when you use the Services. We encourage you to read the Privacy Policy carefully and use it to make informed decisions.
                            Hence by using the Services, you agree to the terms of this Privacy Policy and your continued use of the Services constitutes your ongoing agreement to the Privacy Policy. been is a product by Enjam Social Networks Private Limited and therefore this agreement is between you and Enjam Social Networks Private Limited.
                          </Text>

                            <Text style={styles.heading}>Information we collect </Text>
                            <Text style={styles.bullet}>•<Text style={{ fontWeight: 'bold' }}>	Account Information and content you provide - </Text>  When you sign up for been, you give us certain information in order to start using this service. This includes your name, email address, phone number, or any other information you give us will be stored with us. We collect all the content, communications and other information you share while you are using this product. Content like profile picture, profile details, memory posts, video logs, stories, albums, likes, comments, or any other information you share in your account will be stored with us. Our systems automatically process and store the data provided by you and others.</Text>

                            <Text style={styles.bullet}>•<Text style={{ fontWeight: 'bold' }}>	Your usage –</Text> We may collect information about how you use our product, such as the type of content you view or engage with; the features you use; the actions you take; people or accounts you interact with; and the time, frequency and duration of your activities. We also collect and analyse content, communications and information that other people provide when they use been. This can include information about you, such as when others engage to any of your data shared on been.</Text>

                            <Text style={styles.bullet}>•<Text style={{ fontWeight: 'bold' }}>	Voluntarily Information –</Text> We may collect information which you provide us voluntarily. For instance, when you respond to communications from us, communicate with us via email or share additional information about yourself through your use of the Services. We may also collect the feedback, suggestions, complaints and reports which you send to us. Please note that we may also collect complaints about you from other Users, which may include your Personal Information.</Text>

                            <Text style={styles.bullet}>•<Text style={{ fontWeight: 'bold' }}>	Device Information:</Text> We may collect Personal Information from your device. Such information may include geolocation data, IP address, unique identifiers (e.g., UUID) as well as other information which relates to your activity through the Services</Text>


                            <Text style={styles.heading}>What we do with the info we collect </Text>
                            <Text style={styles.text}>We use the information we collect to provide the Service to you. We commit to showing you content that’s relevant, interesting and personal to you. In addition, and for similar reasons, we have a legitimate interest in using your information in these ways. It is also fundamental to the nature of the Service we provide. In short, it’s necessary for us to do these things in order to make the Service relevant, interesting and personal to you like we promised, and it’s in both of our interests for us to do that.</Text>
                            <Text style={styles.text}>We use and share Personal Information in the manners described in this Privacy Policy. In addition to the purposes listed above, the information we collect, which may include your Personal Information, is used for the following purposes:</Text>
                            <Text style={styles.bullet}>• To set up your account and to provide the Services</Text>
                            <Text style={styles.bullet}>• To identify and authenticate your access to the Services </Text>
                            <Text style={styles.bullet}>• To send you relevant push notifications, which are based on different activities offered by the Services</Text>
                            <Text style={styles.bullet}>• To communicate with you and to keep you informed of our latest updates</Text>
                            <Text style={styles.bullet}>• To market our website, products and the Services</Text>
                            <Text style={styles.bullet}>• To serve you personalized ads when you use the Services</Text>
                            <Text style={styles.bullet}>• To perform a research or to conduct analytics in order to improve and customize the Services to your needs and interests</Text>
                            <Text style={styles.bullet}>• To support and troubleshoot the Services and to respond to your queries</Text>
                            <Text style={styles.bullet}>• To investigate and resolve disputes in connection with your use of the Services</Text>
                            <Text style={styles.bullet}>• To detect and prevent fraudulent and illegal activity or any other type of activity that may jeopardize or negatively affect the integrity of the Services</Text>
                            <Text style={styles.bullet}>• To investigate violations and enforce our policies, and as required by law, regulation or other governmental authority, or to comply with a subpoena or similar legal process or respond to a government request</Text>

                            <Text style={styles.heading}>Transferring your information: </Text>
                            <Text style={styles.text}>been is a global service, by using our products or services, you authorize us to transfer and store your information outside your home country, for the purposes described in this policy. The privacy protections and the rights of authorities to access your personal information in such countries may not be equivalent to those of your home country. We do not rent, sell, or share your Personal Information with third-parties except as described in this Privacy Policy.</Text>

                            <Text style={styles.heading}>Whom, How and when we share information:</Text>
                            <Text style={styles.text}>We may share Personal Information with our subsidiaries, affiliated companies, subcontractors, third-part service providers, auditors/advisers of our business. We may also share the information with any potential purchasers or investors of our business processes.</Text>
                            <Text style={styles.text}>In addition to the purposes listed in this Privacy Policy, we may share Personal Information with our recipients for any of the following purposes: </Text>
                            <Text style={styles.bullet}>• Storing or processing Personal Information on our behalf (e.g., cloud computing service providers);</Text>
                            <Text style={styles.bullet}>• Processing such information to assist us with our business operations;</Text>
                            <Text style={styles.bullet}>• Performing research, technical diagnostics, personalization and analytics.</Text>
                            <Text style={styles.text}>We may also disclose Personal Information, or any information you submitted via the Services if we have a good faith belief that disclosure of such information is helpful or reasonably necessary to:</Text>
                            <Text style={styles.bullet}>• Enforce our policies, including investigations of potential violations thereof</Text>
                            <Text style={styles.bullet}>• To establish or exercise our rights to defend against legal clai</Text>
                            <Text style={styles.bullet}>• Prevent harm to the rights, property or safety of us, our affiliates, our Users, yourself or any third-party</Text>
                            <Text style={styles.bullet}>• In case we find it necessary in order to enforce intellectual property or other legal rights.</Text>

                            <Text style={styles.heading}>How we promote safety, integrity and security:</Text>
                            <Text style={styles.text}>We use the information we have to verify accounts and activity, combat harmful conduct, detect and prevent spam and other bad experiences, maintain the integrity of our product and its services. We use the information to investigate, detect, prevent, or take action regarding illegal activities or other wrongdoing, suspected fraud or security issues in our product. We access, preserve and share your information with regulators, law enforcement or others in response to a legal request (like a search warrant, court order or subpoena) if we have a good faith belief that the law requires us to do so. This may include jurisdictions outside your home country when, we have a good-faith belief that the response is required by law in that jurisdiction, affects users in that jurisdiction, and is consistent with internationally recognised standards.</Text>

                            <Text style={styles.heading}>How long we keep your information:</Text>
                            <Text style={styles.text}>Information we collect about you can be accessed and preserved for an extended period when it is the subject of a legal request or obligation, governmental investigation, or investigations of possible violations of our terms or policies, or otherwise to prevent harm.</Text>

                            <Text style={styles.heading}>How we make amendments to this policy:</Text>
                            <Text style={styles.text}>We may change this policy from time to time and if we do, we’ll post any changes on this page. If you continue to use been after those changes are in effect, you agree to the new policy. If the changes are significant, we’ll notify you about the changes to this policy and give you the opportunity to review the revised policy before you chose to continue using our product.</Text>

                            <Text style={styles.heading}>Contact us:</Text>
                            <Text style={styles.contact}>If you have any general questions regarding the Services or the information that we collect about you and how we use it, please contact us at support@beenofficial.com.</Text>


                        </View>
                    </ScrollView>

                </View>
            </View>
        )
    }

}
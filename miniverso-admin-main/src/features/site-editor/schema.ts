
import {validateSiteDocument as validate, isSafeSiteUrl, PAGE_PATHS, SECTION_TYPES as sectionTypes, UI_FIELDS} from '../../../../shared/site-content.mjs';
export {isSafeSiteUrl,PAGE_PATHS,UI_FIELDS};
export type SiteItem={id:string;title:string;description:string;image:string;imageAlt:string;caption:string;href:string;tag:string};
export type HeroSlide={id:string;title:string;image:string;imageAlt:string;caption:string};
export type SiteHero={masthead:string;eyebrow:string;title:string;description:string;image:string;imageAlt:string;caption:string;imagePosition:string;buttonLabel:string;buttonHref:string;scrollLabel:string;scrollHref:string;slides:HeroSlide[]};
export type SectionType='intro'|'formats'|'solutions'|'projects'|'catalog'|'featured'|'values'|'experience'|'digital'|'contact'|'cta';
export type SiteSection={id:string;type:SectionType;projectId?:string;projectIds:string[];limit:number;visible:boolean;eyebrow:string;title:string;description:string;supportTitle:string;supportText:string;image:string;imageAlt:string;caption:string;buttonLabel:string;buttonHref:string;items:SiteItem[]};
export type SitePage={id:string;path:string;label:string;seoTitle:string;seoDescription:string;hero:SiteHero;ribbon:{visible:boolean;text:string};sections:SiteSection[]};
export type SiteAsset={id:string;type:'image'|'video';src:string;alt:string;caption?:string;poster?:string};
export type SiteProject={id:string;slug:string;title:string;tag:string;description:string;introduction:string;visible:boolean;order:number;categoryIds:string[];cover:SiteAsset;presentation:SiteAsset;gallery:SiteAsset[];facts:{label:string;value:string}[];story:{title:string;text:string}[]};
export type SiteSettings={brand:string;tagline:string;email:string;whatsapp:string;instagram:string;location:string;headerButton:string;headerButtonHref:string;footerTitle:string;footerDescription:string;footerButton:string;footerButtonHref:string;copyright:string;logo:string;logoAlt:string;favicon:string;seoTitle:string;seoDescription:string};
export type SiteContact={title:string;description:string;subjects:string[];button:string;consentLabel:string;successText:string;errorText:string;privacyText:string};
export type SiteDigital={siteEyebrow:string;siteTitle:string;siteDescription:string;socialEyebrow:string;socialTitle:string;socialDescription:string;devices:{id:string;title:string;image:string;imageAlt:string;caption:string;href:string}[];social:{whatsappLabel:string;instagramLabel:string;siteLabel:string;whatsappAction:string;bio:string;followers:string;following:string;profileLink:string;highlights:string[];posts:SiteAsset[];messages:{id:string;text:string;direction:'sent'|'received'}[]}};
export type SiteDocument={schemaVersion:1;revision:number;publishedAt:string;settings:SiteSettings;ui:Record<string,string>;digital:SiteDigital;contact:SiteContact;pages:SitePage[];projects:SiteProject[]};
export const SECTION_TYPES=sectionTypes as Record<SectionType,string>;
export function validateSiteDocument(input:unknown):SiteDocument{return validate(input) as SiteDocument;}

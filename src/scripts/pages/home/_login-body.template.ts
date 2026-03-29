import { HtmlUtils } from "../../utilities/_html";

export class LoginBodyTemplate {
	private static readonly MICROSOFT_SVG_PATH = "./assets/icons/microsoft.svg";
	private static readonly DEFAULT_LOGIN_TEXT = "Sign in with Microsoft";
	private static readonly LOADING_LOGIN_TEXT = "Signing in...";
	private isLoginInProgress = false;

	constructor(
		private readonly onLoginBtnClick: () => Promise<void>,
	) { }

	public build(): HTMLElement {
		const container = HtmlUtils.stringToSingleHtmlElement(`
			<section class="vh-100 d-flex align-items-center justify-content-center px-3 py-4" style="background-color:#f3f3f3; background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://localhost:7115/images/background.png'); background-size: cover; background-position: center;">

				<div class="w-100" style="max-width:560px; border:1px solid #cfcfcf; border-radius:4px; background:#f4f4f4; overflow:hidden; box-shadow:0 1px 0 rgba(0, 0, 0, 0.02);">
					<div class="p-4 p-md-5">

						<div class="text-center mb-4">
							<img src="https://localhost:7115/images/logo.png" alt="Logo" style="max-height: 80px; width: 160px; object-fit: cover; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);" />
						</div>

						<h2 class="mb-3" style="font-size:48px; color:#303030; line-height:1.05; font-weight:600;">Sign in</h2>
						<p class="mb-4" style="font-size:36px; color:#606060; line-height:1.1;">to continue to TwoDrive</p>

						<button type="button" data-home-login-btn="true" class="w-100 d-flex align-items-center justify-content-center gap-3" style="height:52px; border:1px solid #bdbdbd; background-color:#f7f7f7; color:#3b3b3b; font-size:16px; font-weight:600;">
							<img src="${LoginBodyTemplate.MICROSOFT_SVG_PATH}" width="22" height="22" alt="" aria-hidden="true" />
							<span data-home-login-btn-label="true">${LoginBodyTemplate.DEFAULT_LOGIN_TEXT}</span>
						</button>

						<p class="text-center mb-0 mt-4" style="font-size:14px; color:#5f5f5f; line-height:1.5;">
							By signing in, you agree to Microsoft's
							<a href="#" style="color:#0067b8; text-decoration:none;">Terms of Service</a>
							and
							<a href="#" style="color:#0067b8; text-decoration:none;">Privacy Policy</a>.
						</p>
					</div>

					<div class="d-flex align-items-center justify-content-between px-4 py-3" style="border-top:1px solid #d8d8d8; background-color:#efefef; font-size:14px; color:#6a6a6a;">
						<div class="d-flex gap-4">
							<a href="#" style="color:#6a6a6a; text-decoration:none;">Terms of use</a>
							<a href="#" style="color:#6a6a6a; text-decoration:none;">Privacy &amp; cookies</a>
						</div>
					</div>
				</div>
			</section>
		`);

		const loginButton = container.querySelector<HTMLButtonElement>("[data-home-login-btn='true']");
		const loginButtonLabel = container.querySelector<HTMLSpanElement>("[data-home-login-btn-label='true']");

		loginButton?.addEventListener("click", async () => {
			if (this.isLoginInProgress || !loginButton || !loginButtonLabel) {
				return;
			}

			this.setLoginLoadingState(loginButton, loginButtonLabel, true);

			try {
				await this.onLoginBtnClick();
			} finally {
				this.setLoginLoadingState(loginButton, loginButtonLabel, false);
			}
		});

		return container;
	}

	private setLoginLoadingState(
		loginButton: HTMLButtonElement,
		loginButtonLabel: HTMLSpanElement,
		isLoading: boolean,
	): void {
		this.isLoginInProgress = isLoading;
		loginButton.disabled = isLoading;
		loginButton.setAttribute("aria-busy", String(isLoading));
		loginButton.style.opacity = isLoading ? "0.75" : "1";
		loginButton.style.cursor = isLoading ? "not-allowed" : "pointer";
		loginButtonLabel.textContent = isLoading
			? LoginBodyTemplate.LOADING_LOGIN_TEXT
			: LoginBodyTemplate.DEFAULT_LOGIN_TEXT;
	}
}
